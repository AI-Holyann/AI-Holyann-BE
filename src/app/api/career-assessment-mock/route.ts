import {NextRequest, NextResponse} from 'next/server'

// Mock career assessment API for testing when external service is not available
export async function POST(request: NextRequest) {
    try {
        const {student_id} = await request.json()

        if (!student_id) {
            return NextResponse.json({
                success: false,
                error: 'student_id is required'
            }, {status: 400})
        }

        console.log('🧪 [Mock Career Assessment] Generating mock recommendations for student:', student_id)

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Mock assessment results
        const mockAssessment = {
            mbti: {
                personality_type: "ENTP",
                confidence: 0.786,
                dimension_scores: {
                    E: 0.832,
                    I: 0.168,
                    S: 0.151,
                    N: 0.849,
                    T: 0.835,
                    F: 0.165,
                    J: 0.176,
                    P: 0.824
                }
            },
            grit: {
                score: 3.92,
                level: "Trên trung bình",
                description: "Bạn có nghị lực khá tốt nhưng vẫn còn cải thiện được."
            },
            riasec: {
                code: "RIA",
                scores: {
                    Realistic: 85.0,
                    Investigative: 78.0,
                    Artistic: 72.0,
                    Social: 45.0,
                    Enterprising: 38.0,
                    Conventional: 32.0
                },
                top3: [
                    ["Realistic", 85.0],
                    ["Investigative", 78.0],
                    ["Artistic", 72.0]
                ]
            }
        }

        // Mock career recommendations
        const mockRecommendations = [
            {
                title: "Kỹ sư Phần mềm",
                match_score: 92.5,
                riasec_code: "RIA",
                riasec_scores: {R: 8.0, I: 9.0, A: 7.0, S: 3.0, E: 4.0, C: 5.0}
            },
            {
                title: "Nhà thiết kế UX/UI",
                match_score: 88.3,
                riasec_code: "ARI",
                riasec_scores: {R: 6.0, I: 7.0, A: 9.0, S: 4.0, E: 5.0, C: 3.0}
            },
            {
                title: "Kiến trúc sư",
                match_score: 85.7,
                riasec_code: "RAI",
                riasec_scores: {R: 8.0, I: 6.0, A: 8.0, S: 3.0, E: 4.0, C: 5.0}
            },
            {
                title: "Nhà nghiên cứu AI/ML",
                match_score: 83.2,
                riasec_code: "IRA",
                riasec_scores: {R: 7.0, I: 9.0, A: 6.0, S: 2.0, E: 3.0, C: 4.0}
            },
            {
                title: "Game Developer",
                match_score: 81.4,
                riasec_code: "RAI",
                riasec_scores: {R: 7.0, I: 6.0, A: 8.0, S: 3.0, E: 4.0, C: 3.0}
            },
            {
                title: "Data Scientist",
                match_score: 79.8,
                riasec_code: "IR",
                riasec_scores: {R: 6.0, I: 9.0, A: 4.0, S: 3.0, E: 5.0, C: 6.0}
            },
            {
                title: "Nhà thiết kế Công nghiệp",
                match_score: 77.6,
                riasec_code: "RAE",
                riasec_scores: {R: 8.0, I: 5.0, A: 7.0, S: 3.0, E: 6.0, C: 4.0}
            },
            {
                title: "Web Developer",
                match_score: 75.3,
                riasec_code: "RIA",
                riasec_scores: {R: 7.0, I: 7.0, A: 6.0, S: 3.0, E: 4.0, C: 4.0}
            },
            {
                title: "Robotics Engineer",
                match_score: 73.1,
                riasec_code: "RIE",
                riasec_scores: {R: 9.0, I: 8.0, A: 4.0, S: 2.0, E: 5.0, C: 5.0}
            },
            {
                title: "Technical Writer",
                match_score: 70.9,
                riasec_code: "IAC",
                riasec_scores: {R: 4.0, I: 7.0, A: 6.0, S: 4.0, E: 3.0, C: 7.0}
            }
        ]

        // Transform to our format
        const recommendations = mockRecommendations.map(rec => ({
            name: rec.title,
            category: rec.riasec_code,
            matchReason: `Phù hợp ${rec.match_score.toFixed(1)}% dựa trên kết quả test MBTI (${mockAssessment.mbti.personality_type}), RIASEC (${mockAssessment.riasec.code}), và Grit (${mockAssessment.grit.score}/5.0)`,
            careerPaths: getCareerPaths(rec.title),
            requiredSkills: getRequiredSkills(rec.title),
            matchPercentage: Math.round(rec.match_score),
            riasecCode: rec.riasec_code,
            riasecScores: rec.riasec_scores
        }))

        console.log('✅ [Mock Career Assessment] Generated', recommendations.length, 'recommendations')

        return NextResponse.json({
            success: true,
            assessment: mockAssessment,
            recommendations,
            message: `Generated ${recommendations.length} mock career recommendations`,
            note: "This is mock data for testing. Replace with real external API when available."
        })

    } catch (error: any) {
        console.error('❌ [Mock Career Assessment] Error:', error)
        return NextResponse.json({
            success: false,
            error: error.message || 'Internal server error'
        }, {status: 500})
    }
}

function getCareerPaths(jobTitle: string): string[] {
    const careerPaths: Record<string, string[]> = {
        "Kỹ sư Phần mềm": ["Junior Developer", "Senior Developer", "Tech Lead", "Engineering Manager", "CTO"],
        "Nhà thiết kế UX/UI": ["UI Designer", "UX Designer", "Product Designer", "Design Lead", "Creative Director"],
        "Kiến trúc sư": ["Junior Architect", "Architect", "Senior Architect", "Principal Architect", "Design Director"],
        "Nhà nghiên cứu AI/ML": ["ML Engineer", "Research Scientist", "Senior Researcher", "Principal Scientist", "Research Director"],
        "Game Developer": ["Junior Game Dev", "Game Programmer", "Senior Game Dev", "Lead Developer", "Game Director"],
        "Data Scientist": ["Data Analyst", "Data Scientist", "Senior Data Scientist", "Principal Data Scientist", "Chief Data Officer"],
        "Nhà thiết kế Công nghiệp": ["Industrial Designer", "Senior Designer", "Design Manager", "Design Director"],
        "Web Developer": ["Frontend Developer", "Full-stack Developer", "Senior Developer", "Tech Lead", "Engineering Manager"],
        "Robotics Engineer": ["Robotics Engineer", "Senior Engineer", "Principal Engineer", "Engineering Manager", "CTO"],
        "Technical Writer": ["Technical Writer", "Senior Writer", "Content Manager", "Documentation Manager", "Head of Content"]
    }

    return careerPaths[jobTitle] || ["Entry Level", "Mid Level", "Senior Level", "Management", "Executive"]
}

function getRequiredSkills(jobTitle: string): string[] {
    const skills: Record<string, string[]> = {
        "Kỹ sư Phần mềm": ["Programming", "Problem Solving", "Software Design", "Testing", "Version Control"],
        "Nhà thiết kế UX/UI": ["Design Thinking", "Prototyping", "User Research", "Visual Design", "Figma/Sketch"],
        "Kiến trúc sư": ["AutoCAD", "3D Modeling", "Building Codes", "Project Management", "Creative Design"],
        "Nhà nghiên cứu AI/ML": ["Python", "Machine Learning", "Statistics", "Research Methods", "Deep Learning"],
        "Game Developer": ["C#/C++", "Unity/Unreal", "Game Design", "3D Graphics", "Problem Solving"],
        "Data Scientist": ["Python/R", "Statistics", "Data Visualization", "SQL", "Machine Learning"],
        "Nhà thiết kế Công nghiệp": ["CAD", "3D Modeling", "Material Science", "Manufacturing", "Creative Design"],
        "Web Developer": ["HTML/CSS", "JavaScript", "Frameworks", "Responsive Design", "API Integration"],
        "Robotics Engineer": ["C/C++", "Electronics", "Control Systems", "Mechanical Design", "Programming"],
        "Technical Writer": ["Writing", "Technical Knowledge", "Communication", "Documentation Tools", "Research"]
    }

    return skills[jobTitle] || ["Communication", "Problem Solving", "Critical Thinking", "Teamwork", "Adaptability"]
}