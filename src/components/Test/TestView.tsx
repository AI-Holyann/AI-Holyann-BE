import React, {useState} from 'react';
import {RotateCcw} from 'lucide-react';
import {Question, TestType} from '../types';
import {TEST_DESCRIPTIONS} from '@/constants';

interface TestViewProps {
    testType: TestType;
    questions: Question[];
    onBack: () => void;
    onComplete: (answers: Record<number, string | number | boolean>) => void;
}

const ProgressBar: React.FC<{ current: number; total: number }> = ({current, total}) => {
    const percentage = Math.round(((current + 1) / total) * 100);
    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{width: `${percentage}%`}}
            ></div>
        </div>
    );
};

const TestView: React.FC<TestViewProps> = ({testType, questions, onBack, onComplete}) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string | number | boolean>>({});

    const handleAnswer = (value: string | number | boolean) => {
        const question = questions[currentQuestionIndex];
        const newAnswers = {...answers, [question.id]: value};
        setAnswers(newAnswers);

        if (currentQuestionIndex < questions.length - 1) {
            setTimeout(() => setCurrentQuestionIndex(prev => prev + 1), 250);
        } else {
            onComplete(newAnswers);
        }
    };

    const question = questions[currentQuestionIndex];
    if (!question) return null;

    return (
        <div className="max-w-3xl mx-auto pt-8">
            <button
                onClick={onBack}
                className="text-gray-500 hover:text-gray-900 mb-6 flex items-center gap-2 text-sm font-medium"
            >
                <RotateCcw size={16}/> Quay lại
            </button>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12">
                <div className="flex justify-between items-center mb-4 text-sm text-gray-500 font-medium">
                    <span>{TEST_DESCRIPTIONS[testType].title}</span>
                    <span>Câu {currentQuestionIndex + 1} / {questions.length}</span>
                </div>

                <ProgressBar current={currentQuestionIndex} total={questions.length}/>

                <h3 className="text-2xl font-bold text-gray-900 mb-8 leading-snug">
                    {question.text}
                </h3>

                <div className="space-y-4">
                    {testType === 'MBTI' && (
                        <div className="space-y-6">
                            {/* Likert Scale 7 mức cho MBTI: -3 đến 3 */}
                            <div className="flex justify-between text-xs md:text-sm font-medium text-gray-500 px-2">
                                <span>Rất không đồng ý</span>
                                <span>Trung lập</span>
                                <span className="text-right">Rất đồng ý</span>
                            </div>
                            <div className="flex justify-between gap-1 md:gap-2">
                                {[-3, -2, -1, 0, 1, 2, 3].map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => handleAnswer(val)}
                                        className={`w-full aspect-square md:aspect-auto md:h-14 rounded-lg border-2 hover:shadow-lg hover:scale-105 transition-all duration-200 font-bold text-base md:text-lg shadow-sm
                                            ${val < 0
                                            ? 'bg-gradient-to-b from-red-50 to-red-100 border-red-200 text-red-700 hover:from-red-500 hover:to-red-600 hover:text-white hover:border-red-600'
                                            : val === 0
                                                ? 'bg-gradient-to-b from-gray-50 to-gray-100 border-gray-200 text-gray-700 hover:from-gray-500 hover:to-gray-600 hover:text-white hover:border-gray-600'
                                                : 'bg-gradient-to-b from-green-50 to-green-100 border-green-200 text-green-700 hover:from-green-500 hover:to-green-600 hover:text-white hover:border-green-600'
                                        }`}
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 px-1">
                                <span>-3</span>
                                <span>-2</span>
                                <span>-1</span>
                                <span>0</span>
                                <span>1</span>
                                <span>2</span>
                                <span>3</span>
                            </div>
                        </div>
                    )}

                    {testType === 'RIASEC' && (
                        <div className="space-y-6">
                            {/* Likert Scale 5 mức cho RIASEC: 1-5 */}
                            <p className="text-center text-gray-500 text-sm mb-4 font-medium">
                                Bạn thích làm công việc này ở mức độ nào?
                            </p>
                            <div
                                className="flex justify-between text-xs md:text-sm font-medium text-gray-500 px-2 mb-2">
                                <span>Rất không thích</span>
                                <span className="text-right">Rất thích</span>
                            </div>
                            <div className="flex justify-between gap-2">
                                {[1, 2, 3, 4, 5].map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => handleAnswer(val)}
                                        className="w-full aspect-square md:aspect-auto md:h-16 rounded-xl bg-gradient-to-b from-blue-50 to-blue-100 border-2 border-blue-200 hover:from-blue-500 hover:to-blue-600 hover:text-white hover:border-blue-600 hover:shadow-lg hover:scale-105 transition-all duration-200 font-bold text-xl text-blue-700 shadow-sm"
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 px-1">
                                {['Rất không thích', 'Không thích', 'Trung lập', 'Thích', 'Rất thích'].map((label, idx) => (
                                    <span key={idx} className="text-center" style={{width: '20%'}}>{label}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {testType === 'GRIT' && (
                        <div className="space-y-6">
                            <div className="flex justify-between text-xs md:text-sm font-medium text-gray-500 px-2">
                                <span>Không giống tôi <br/>chút nào</span>
                                <span className="text-right">Rất giống tôi</span>
                            </div>
                            <div className="flex justify-between gap-2">
                                {[1, 2, 3, 4, 5].map((val) => (
                                    <button
                                        key={val}
                                        onClick={() => handleAnswer(val)}
                                        className="w-full aspect-square md:aspect-auto md:h-14 rounded-lg bg-gray-50 border border-gray-200 hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all font-bold text-lg text-gray-700 shadow-sm"
                                    >
                                        {val}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TestView;
