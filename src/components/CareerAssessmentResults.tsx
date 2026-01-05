'use client'

import React, {useState} from 'react'

interface CareerRecommendation {
    name: string
    category: string
    matchReason: string
    careerPaths: string[]
    requiredSkills: string[]
    matchPercentage: number
    riasecCode?: string
    riasecScores?: Record<string, number>
}

interface CareerAssessment {
    mbti: {
        personality_type: string
        confidence: number
        dimension_scores: Record<string, number>
    }
    grit: {
        score: number
        level: string
        description: string
    }
    riasec: {
        code: string
        scores: Record<string, number>
        top3: [string, number][]
    }
}

interface CareerAssessmentResultsProps {
    studentId: string
    onClose: () => void
}

function CareerAssessmentResults({studentId, onClose}: CareerAssessmentResultsProps) {
    const [loading, setLoading] = useState(false)
    const [assessment, setAssessment] = useState<CareerAssessment | null>(null)
    const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([])
    const [error, setError] = useState<string | null>(null)
    const [showDetails, setShowDetails] = useState(false)

    const handleGetRecommendations = async () => {
        setLoading(true)
        setError(null)

        try {
            console.log('🎯 Getting career recommendations for student:', studentId)

            // Try real API first
            let response = await fetch('/api/career-assessment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({student_id: studentId})
            })

            // If real API fails (external service unavailable), try mock API
            if (!response.ok && response.status === 503) {
                console.log('🧪 Real API unavailable, trying mock API...')
                response = await fetch('/api/career-assessment-mock', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({student_id: studentId})
                })
            }

            const data = await response.json()

            if (!data.success) {
                throw new Error(data.error || 'Không thể lấy đề xuất nghề nghiệp')
            }

            setAssessment(data.assessment)
            setRecommendations(data.recommendations || [])

            if (data.note) {
                console.log('ℹ️ Note:', data.note)
            }

            console.log('✅ Career recommendations received:', data.recommendations?.length || 0)

        } catch (error: any) {
            console.error('❌ Career assessment error:', error)

            // Last fallback: try mock API if all else fails
            try {
                console.log('🧪 Final fallback to mock API...')
                const mockResponse = await fetch('/api/career-assessment-mock', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({student_id: studentId})
                })

                const mockData = await mockResponse.json()

                if (mockData.success) {
                    setAssessment(mockData.assessment)
                    setRecommendations(mockData.recommendations || [])
                    setError('⚠️ Đang sử dụng dữ liệu mẫu do dịch vụ phân tích chưa sẵn sàng')
                    return
                }
            } catch (mockError) {
                console.error('❌ Mock API also failed:', mockError)
            }

            setError(error.message || 'Đã xảy ra lỗi khi lấy đề xuất nghề nghiệp')
        } finally {
            setLoading(false)
        }
    }

    const getMatchColor = (percentage: number) => {
        if (percentage >= 80) return 'text-green-600 bg-green-50'
        if (percentage >= 60) return 'text-blue-600 bg-blue-50'
        if (percentage >= 40) return 'text-yellow-600 bg-yellow-50'
        return 'text-gray-600 bg-gray-50'
    }

    const getRIASECDescription = (code: string) => {
        const descriptions: Record<string, string> = {
            'R': 'Realistic - Thực tế',
            'I': 'Investigative - Nghiên cứu',
            'A': 'Artistic - Nghệ thuật',
            'S': 'Social - Xã hội',
            'E': 'Enterprising - Doanh nghiệp',
            'C': 'Conventional - Truyền thống'
        }
        return code.split('').map(c => descriptions[c] || c).join(' + ')
    }

    if (!recommendations.length && !loading && !error) {
        return (
            <div
                className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 mt-8">
                <div className="text-center">
                    <div
                        className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor"
                             viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        🎯 Khám phá nghề nghiệp phù hợp
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                        Dựa trên kết quả 3 bài test, chúng tôi sẽ đề xuất những nghề nghiệp phù hợp nhất với bạn
                    </p>
                    <button
                        onClick={handleGetRecommendations}
                        disabled={loading}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <div className="flex items-center space-x-2">
                                <div
                                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Đang phân tích...</span>
                            </div>
                        ) : (
                            'Xem đề xuất nghề nghiệp'
                        )}
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="mt-8 space-y-6">
            {error && (
                <div
                    className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-4 rounded-xl">
                    <div className="flex items-center space-x-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"/>
                        </svg>
                        <span className="font-semibold">Lỗi:</span>
                        <span>{error}</span>
                    </div>
                </div>
            )}

            {assessment && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            📊 Tổng hợp kết quả đánh giá
                        </h3>
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 text-sm font-medium"
                        >
                            {showDetails ? 'Ẩn chi tiết' : 'Xem chi tiết'}
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                            <div className="font-semibold text-blue-900 dark:text-blue-300">MBTI</div>
                            <div
                                className="text-2xl font-bold text-blue-700 dark:text-blue-400">{assessment.mbti.personality_type}</div>
                            <div className="text-sm text-blue-600 dark:text-blue-400">Độ tin
                                cậy: {(assessment.mbti.confidence * 100).toFixed(1)}%
                            </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                            <div className="font-semibold text-green-900 dark:text-green-300">GRIT</div>
                            <div
                                className="text-2xl font-bold text-green-700 dark:text-green-400">{assessment.grit.score.toFixed(2)}/5.0
                            </div>
                            <div className="text-sm text-green-600 dark:text-green-400">{assessment.grit.level}</div>
                        </div>

                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                            <div className="font-semibold text-purple-900 dark:text-purple-300">RIASEC</div>
                            <div
                                className="text-2xl font-bold text-purple-700 dark:text-purple-400">{assessment.riasec.code}</div>
                            <div
                                className="text-sm text-purple-600 dark:text-purple-400">{getRIASECDescription(assessment.riasec.code)}</div>
                        </div>
                    </div>

                    {showDetails && (
                        <div
                            className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">MBTI Chi tiết:</h4>
                                <div className="space-y-1 text-sm">
                                    {Object.entries(assessment.mbti.dimension_scores).map(([dim, score]) => (
                                        <div key={dim} className="flex justify-between">
                                            <span>{dim}:</span>
                                            <span>{(score * 100).toFixed(1)}%</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">RIASEC Top 3:</h4>
                                <div className="space-y-1 text-sm">
                                    {assessment.riasec.top3.map(([category, score], index) => (
                                        <div key={category} className="flex justify-between">
                                            <span>{index + 1}. {category}:</span>
                                            <span>{score}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {recommendations.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            🎯 Đề xuất nghề nghiệp ({recommendations.length} nghề)
                        </h3>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    <div className="grid gap-4">
                        {recommendations.map((rec, index) => (
                            <div key={index}
                                 className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg text-gray-900 dark:text-white">{rec.name}</h4>
                                        {rec.riasecCode && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Mã RIASEC: {rec.riasecCode} - {getRIASECDescription(rec.riasecCode)}
                                            </p>
                                        )}
                                    </div>
                                    <div
                                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getMatchColor(rec.matchPercentage)}`}>
                                        {rec.matchPercentage}% phù hợp
                                    </div>
                                </div>

                                <p className="text-gray-700 dark:text-gray-300 mb-3">{rec.matchReason}</p>

                                {rec.riasecScores && (
                                    <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
                                        {Object.entries(rec.riasecScores).map(([code, score]) => (
                                            <div key={code} className="text-center">
                                                <div
                                                    className="text-xs font-medium text-gray-600 dark:text-gray-400">{code}</div>
                                                <div
                                                    className="text-sm font-bold text-gray-900 dark:text-white">{score}</div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default CareerAssessmentResults
