'use client';

import { useParams } from 'next/navigation';
import StudentProfile from '@/components/StudentProfile';

export default function StudentProfilePage() {
    const params = useParams();
    const studentId = params.student_id as string;

    return <StudentProfile studentId={studentId} />;
}
