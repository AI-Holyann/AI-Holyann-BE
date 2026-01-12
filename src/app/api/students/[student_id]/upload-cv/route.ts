import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ student_id: string }> }
) {
    try {
        const { student_id } = await params;
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json(
                { error: 'Không có file được tải lên' },
                { status: 400 }
            );
        }

        // Kiểm tra định dạng file
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: 'Chỉ chấp nhận file PDF, DOC, DOCX' },
                { status: 400 }
            );
        }

        // Tạo thư mục uploads nếu chưa tồn tại
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'cvs');
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Tạo tên file unique
        const timestamp = Date.now();
        const extension = path.extname(file.name);
        const fileName = `cv_${student_id}_${timestamp}${extension}`;
        const filePath = path.join(uploadDir, fileName);

        // Lưu file
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        const fileUrl = `/uploads/cvs/${fileName}`;

        // TODO: Xử lý extract thông tin từ CV bằng AI
        // Có thể sử dụng các dịch vụ như:
        // - OpenAI GPT-4 Vision
        // - Google Document AI
        // - Azure Form Recognizer
        // - Custom CV parser

        return NextResponse.json({
            success: true,
            fileUrl,
            message: 'Upload CV thành công',
            note: 'Vui lòng kiểm tra và điền bổ sung thông tin còn thiếu'
        });
    } catch (error) {
        console.error('❌ Error uploading CV:', error);
        return NextResponse.json(
            { error: 'Lỗi khi upload CV' },
            { status: 500 }
        );
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ student_id: string }> }
) {
    try {
        const { student_id } = await params;

        // Lấy danh sách CV đã upload của học sinh
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'cvs');
        
        if (!existsSync(uploadDir)) {
            return NextResponse.json([]);
        }

        const fs = require('fs');
        const files = fs.readdirSync(uploadDir);
        
        const studentFiles = files
            .filter((file: string) => file.startsWith(`cv_${student_id}_`))
            .map((file: string) => ({
                name: file,
                url: `/uploads/cvs/${file}`,
                uploadedAt: fs.statSync(path.join(uploadDir, file)).mtime
            }))
            .sort((a: any, b: any) => b.uploadedAt - a.uploadedAt);

        return NextResponse.json(studentFiles);
    } catch (error) {
        console.error('❌ Error fetching CVs:', error);
        return NextResponse.json(
            { error: 'Lỗi khi lấy danh sách CV' },
            { status: 500 }
        );
    }
}
