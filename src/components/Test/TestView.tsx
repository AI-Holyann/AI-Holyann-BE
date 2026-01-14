import React, {useState} from 'react';
import {RotateCcw, ChevronLeft, ChevronRight, Check, List, X} from 'lucide-react';
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
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-6">
            <div
                className="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{width: `${percentage}%`}}
            ></div>
        </div>
    );
};

const TestView: React.FC<TestViewProps> = ({testType, questions, onBack, onComplete}) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string | number | boolean>>({});
    const [showQuestionList, setShowQuestionList] = useState(false);

    const handleAnswer = (value: string | number | boolean) => {
        const question = questions[currentQuestionIndex];
        const newAnswers = {...answers, [question.id]: value};
        setAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleComplete = () => {
        // Check if all questions are answered
        const unansweredCount = questions.filter(q => answers[q.id] === undefined).length;
        if (unansweredCount > 0) {
            const confirm = window.confirm(
                `Bạn còn ${unansweredCount} câu chưa trả lời. Bạn có chắc muốn nộp bài không?`
            );
            if (!confirm) return;
        }
        onComplete(answers);
    };

    const handleJumpToQuestion = (index: number) => {
        setCurrentQuestionIndex(index);
        setShowQuestionList(false);
    };

    const getAnswerDisplay = (questionId: number) => {
        const answer = answers[questionId];
        if (answer === undefined) return null;

        // Format answer based on test type
        if (testType === 'MBTI') {
            return answer; // -3 to 3
        } else if (testType === 'RIASEC' || testType === 'GRIT') {
            return answer; // 1 to 5
        }
        return answer;
    };

    const question = questions[currentQuestionIndex];
    const currentAnswer = answers[question?.id];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    const answeredCount = Object.keys(answers).length;

    if (!question) return null;

    return (
        <div className="max-w-7xl mx-auto pt-8 px-4">
            <div className="flex gap-6">
                {/* Question List Panel - Fixed Sidebar */}
                <div className={`
                    fixed lg:sticky top-0 left-0 h-screen lg:h-auto z-50 lg:z-auto
                    w-80 lg:w-72 flex-shrink-0
                    bg-white dark:bg-gray-800 border-r lg:border border-gray-200 dark:border-gray-700 shadow-2xl lg:shadow-lg lg:rounded-2xl
                    transition-transform duration-300 ease-in-out
                    ${showQuestionList ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    overflow-hidden
                `}>
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                                <List size={20} className="text-blue-600 dark:text-blue-400"/>
                                Danh sách câu hỏi
                            </h3>
                            <button
                                onClick={() => setShowQuestionList(false)}
                                className="lg:hidden p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-300"
                            >
                                <X size={20}/>
                            </button>
                        </div>
                        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                            <span className="text-green-600 dark:text-green-400 font-semibold">✓ {answeredCount}</span>
                            {' / '}
                            <span className="text-gray-500 dark:text-gray-400">{questions.length} câu</span>
                        </div>
                    </div>

                    {/* Question List - Scrollable */}
                    <div className="overflow-y-auto h-[calc(100vh-120px)] lg:h-[600px] p-4">
                        <div className="grid grid-cols-5 gap-2">
                            {questions.map((q, index) => {
                                const isAnswered = answers[q.id] !== undefined;
                                const isCurrent = index === currentQuestionIndex;
                                const answerValue = getAnswerDisplay(q.id);

                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => handleJumpToQuestion(index)}
                                        className={`
                                            relative aspect-square rounded-lg font-semibold text-sm
                                            transition-all duration-200
                                            ${isCurrent
                                                ? 'bg-blue-600 dark:bg-blue-500 text-white ring-4 ring-blue-200 dark:ring-blue-800 scale-110 shadow-lg'
                                                : isAnswered
                                                    ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-2 border-green-300 dark:border-green-700 hover:bg-green-200 dark:hover:bg-green-900/60 hover:scale-105'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600 hover:scale-105'
                                            }
                                        `}
                                        title={isAnswered ? `Câu ${index + 1}: Đã trả lời (${answerValue})` : `Câu ${index + 1}: Chưa trả lời`}
                                    >
                                        <div className="flex flex-col items-center justify-center h-full">
                                            <span className="text-xs">{index + 1}</span>
                                            {isAnswered && !isCurrent && (
                                                <span className="text-[10px] mt-0.5 opacity-80">
                                                    {answerValue}
                                                </span>
                                            )}
                                            {isCurrent && (
                                                <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></span>
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 max-w-3xl">
                    <div className="flex items-center justify-between mb-6">
                        <button
                            onClick={onBack}
                            className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 flex items-center gap-2 text-sm font-medium"
                        >
                            <RotateCcw size={16}/> Quay lại
                        </button>

                        {/* Toggle Question List Button (Mobile) */}
                        <button
                            onClick={() => setShowQuestionList(true)}
                            className="lg:hidden flex items-center gap-2 px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                        >
                            <List size={20}/>
                            Danh sách câu
                        </button>
                    </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-xl border border-gray-100 dark:border-gray-700 p-8 md:p-12">
                <div className="flex justify-between items-center mb-4 text-sm text-gray-500 dark:text-gray-400 font-medium">
                    <span>{TEST_DESCRIPTIONS[testType].title}</span>
                    <div className="flex items-center gap-4">
                        <span>Câu {currentQuestionIndex + 1} / {questions.length}</span>
                        <span className="text-green-600 dark:text-green-400">✓ {answeredCount} đã trả lời</span>
                    </div>
                </div>

                <ProgressBar current={currentQuestionIndex} total={questions.length}/>

                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8 leading-snug">
                    {question.text}
                </h3>

                <div className="space-y-4">
                    {testType === 'MBTI' && (
                        <div className="space-y-6">
                            {/* Likert Scale 7 mức cho MBTI: -3 đến 3 */}
                            <div className="flex justify-between text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 px-2">
                                <span>Rất không đồng ý</span>
                                <span>Trung lập</span>
                                <span className="text-right">Rất đồng ý</span>
                            </div>
                            <div className="flex justify-between gap-1 md:gap-2">
                                {[-3, -2, -1, 0, 1, 2, 3].map((val) => {
                                    const isSelected = currentAnswer === val;
                                    return (
                                        <button
                                            key={val}
                                            onClick={() => handleAnswer(val)}
                                            className={`w-full aspect-square md:aspect-auto md:h-14 rounded-lg border-2 transition-all duration-200 font-bold text-base md:text-lg shadow-sm
                                                ${isSelected 
                                                    ? 'scale-110 shadow-xl ring-2 ring-blue-400 dark:ring-blue-600' 
                                                    : 'hover:shadow-lg hover:scale-105'
                                                }
                                                ${val < 0
                                                    ? isSelected
                                                        ? 'bg-red-600 dark:bg-red-500 border-red-700 dark:border-red-600 text-white'
                                                        : 'bg-gradient-to-b from-red-50 to-red-100 dark:from-red-900/40 dark:to-red-800/40 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 hover:from-red-500 hover:to-red-600 dark:hover:from-red-600 dark:hover:to-red-700 hover:text-white hover:border-red-600 dark:hover:border-red-500'
                                                    : val === 0
                                                        ? isSelected
                                                            ? 'bg-gray-600 dark:bg-gray-500 border-gray-700 dark:border-gray-600 text-white'
                                                            : 'bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:from-gray-500 hover:to-gray-600 dark:hover:from-gray-600 dark:hover:to-gray-700 hover:text-white hover:border-gray-600 dark:hover:border-gray-500'
                                                        : isSelected
                                                            ? 'bg-green-600 dark:bg-green-500 border-green-700 dark:border-green-600 text-white'
                                                            : 'bg-gradient-to-b from-green-50 to-green-100 dark:from-green-900/40 dark:to-green-800/40 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 hover:from-green-500 hover:to-green-600 dark:hover:from-green-600 dark:hover:to-green-700 hover:text-white hover:border-green-600 dark:hover:border-green-500'
                                                }`}
                                        >
                                            {val}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 px-1">
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
                            <p className="text-center text-gray-500 dark:text-gray-400 text-sm mb-4 font-medium">
                                Bạn thích làm công việc này ở mức độ nào?
                            </p>
                            <div
                                className="flex justify-between text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 px-2 mb-2">
                                <span>Rất không thích</span>
                                <span className="text-right">Rất thích</span>
                            </div>
                            <div className="flex justify-between gap-2">
                                {[1, 2, 3, 4, 5].map((val) => {
                                    const isSelected = currentAnswer === val;
                                    return (
                                        <button
                                            key={val}
                                            onClick={() => handleAnswer(val)}
                                            className={`w-full aspect-square md:aspect-auto md:h-16 rounded-xl border-2 transition-all duration-200 font-bold text-xl shadow-sm
                                                ${isSelected
                                                    ? 'bg-blue-600 dark:bg-blue-500 border-blue-700 dark:border-blue-600 text-white scale-110 shadow-xl ring-2 ring-blue-400 dark:ring-blue-600'
                                                    : 'bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 hover:from-blue-500 hover:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 hover:text-white hover:border-blue-600 dark:hover:border-blue-500 hover:shadow-lg hover:scale-105'
                                                }`}
                                        >
                                            {val}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 px-1">
                                {['Rất không thích', 'Không thích', 'Trung lập', 'Thích', 'Rất thích'].map((label, idx) => (
                                    <span key={idx} className="text-center" style={{width: '20%'}}>{label}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {testType === 'GRIT' && (
                        <div className="space-y-6">
                            <div className="flex justify-between text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 px-2">
                                <span>Không giống tôi <br/>chút nào</span>
                                <span className="text-right">Rất giống tôi</span>
                            </div>
                            <div className="flex justify-between gap-2">
                                {[1, 2, 3, 4, 5].map((val) => {
                                    const isSelected = currentAnswer === val;
                                    return (
                                        <button
                                            key={val}
                                            onClick={() => handleAnswer(val)}
                                            className={`w-full aspect-square md:aspect-auto md:h-14 rounded-lg border transition-all font-bold text-lg shadow-sm
                                                ${isSelected
                                                    ? 'bg-purple-600 dark:bg-purple-500 text-white border-purple-700 dark:border-purple-600 scale-110 shadow-xl ring-2 ring-purple-400 dark:ring-purple-600'
                                                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-purple-600 dark:hover:bg-purple-500 hover:text-white hover:border-purple-600 dark:hover:border-purple-500'
                                                }`}
                                        >
                                            {val}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation Buttons */}
                <div className="mt-8 flex justify-between items-center gap-4">
                    <button
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all
                            ${currentQuestionIndex === 0
                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 hover:shadow-md'
                            }`}
                    >
                        <ChevronLeft size={20}/>
                        Câu trước
                    </button>

                    <div className="text-center">
                        {currentAnswer !== undefined ? (
                            <span className="text-green-600 dark:text-green-400 text-sm font-medium flex items-center gap-1">
                                <Check size={16}/>
                                Đã chọn đáp án
                            </span>
                        ) : (
                            <span className="text-gray-400 dark:text-gray-500 text-sm font-medium">
                                Chưa chọn đáp án
                            </span>
                        )}
                    </div>

                    {isLastQuestion ? (
                        <button
                            onClick={handleComplete}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 text-white hover:from-green-700 hover:to-emerald-700 dark:hover:from-green-600 dark:hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl"
                        >
                            Nộp bài
                            <Check size={20}/>
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-all shadow-md hover:shadow-lg"
                        >
                            Câu sau
                            <ChevronRight size={20}/>
                        </button>
                    )}
                </div>
            </div>
                </div>
            </div>

            {/* Mobile Overlay */}
            {showQuestionList && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-40 lg:hidden"
                    onClick={() => setShowQuestionList(false)}
                />
            )}
        </div>
    );
};

export default TestView;
