'use client';

import React, {useState, useRef, useEffect} from 'react';
import {
    MessageCircle, Send, Paperclip, Image, Smile, Search,
    Phone, Video, MoreVertical, Users, Star, Award, BookOpen,
    FileText, Target, Clock, CheckCheck, ChevronRight, X,
    Sparkles, GraduationCap, PenTool, Lightbulb
} from 'lucide-react';

// Types
interface Mentor {
    id: string;
    name: string;
    roleCode: 'AS' | 'ACS' | 'ARD' | 'GENERAL';
    roleTitle: string;
    description: string;
    achievements: string[];
    avatar: string;
    isOnline: boolean;
    lastSeen?: string;
}

interface Message {
    id: string;
    senderId: string;
    senderName: string;
    senderAvatar: string;
    content: string;
    timestamp: Date;
    isRead: boolean;
    isMine: boolean;
}

interface Conversation {
    id: string;
    mentor: Mentor;
    lastMessage: string;
    lastMessageTime: Date;
    unreadCount: number;
    messages: Message[];
}

// Mock Data - Mentors
const MENTORS: Record<string, Mentor> = {
    AS: {
        id: 'mentor-as',
        name: 'Ms. Holy Ann',
        roleCode: 'AS',
        roleTitle: 'Admission Strategist',
        description: 'Chịu trách nhiệm lên chiến lược tổng thể, định hướng chọn trường và ngành phù hợp với profile của học sinh.',
        achievements: ['5 năm kinh nghiệm tư vấn', 'Mentor 20+ học sinh đỗ Ivy League', 'Chuyên gia scholarship hunting'],
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
        isOnline: true
    },
    ACS: {
        id: 'mentor-acs',
        name: 'Mr. David Nguyen',
        roleCode: 'ACS',
        roleTitle: 'Application Content Specialist',
        description: 'Chuyên gia biên tập nội dung hồ sơ, review và hướng dẫn viết luận (Personal Statement, Supplemental Essays).',
        achievements: ['Biên tập 500+ bài luận thành công', 'Cựu Admission Officer', 'Tác giả sách "Essay that Wins"'],
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
        isOnline: true
    },
    ARD: {
        id: 'mentor-ard',
        name: 'Ms. Linh Tran',
        roleCode: 'ARD',
        roleTitle: 'Application Research & Development',
        description: 'Phát triển Profile học sinh qua các hoạt động ngoại khóa, nghiên cứu và dự án cộng đồng có chiều sâu.',
        achievements: ['Thiết kế 100+ hoạt động ngoại khóa', 'Chuyên gia STEM research', 'Kết nối với 50+ tổ chức quốc tế'],
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
        isOnline: false,
        lastSeen: '2 giờ trước'
    },
    GENERAL: {
        id: 'mentor-general',
        name: 'Box Chung',
        roleCode: 'GENERAL',
        roleTitle: 'Group Discussion',
        description: 'Không gian thảo luận chung với tất cả các Mentor. Đặt câu hỏi và nhận tư vấn từ đội ngũ chuyên gia.',
        achievements: ['Hỗ trợ 24/7', 'Phản hồi trong 24h', 'Cộng đồng học sinh năng động'],
        avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=150&fit=crop',
        isOnline: true
    }
};

// Mock Messages
const generateMockMessages = (mentorId: string, mentorName: string, mentorAvatar: string): Message[] => {
    const now = new Date();
    return [
        {
            id: `${mentorId}-1`,
            senderId: mentorId,
            senderName: mentorName,
            senderAvatar: mentorAvatar,
            content: 'Chào em! Chị đã xem qua hồ sơ của em rồi. Em có câu hỏi gì không?',
            timestamp: new Date(now.getTime() - 3600000 * 2),
            isRead: true,
            isMine: false
        },
        {
            id: `${mentorId}-2`,
            senderId: 'student',
            senderName: 'Bạn',
            senderAvatar: '/images/avatars/avt.jpg',
            content: 'Dạ chào chị! Em muốn hỏi về chiến lược chọn trường cho mùa apply năm nay ạ.',
            timestamp: new Date(now.getTime() - 3600000 * 1.5),
            isRead: true,
            isMine: true
        },
        {
            id: `${mentorId}-3`,
            senderId: mentorId,
            senderName: mentorName,
            senderAvatar: mentorAvatar,
            content: 'Tốt lắm! Với profile hiện tại của em (GPA 3.8, SAT 1480), chị nghĩ em nên cân nhắc danh sách 8-10 trường theo tỉ lệ: 2 Dream, 4 Match, 2 Safety.',
            timestamp: new Date(now.getTime() - 3600000),
            isRead: true,
            isMine: false
        },
        {
            id: `${mentorId}-4`,
            senderId: 'student',
            senderName: 'Bạn',
            senderAvatar: '/images/avatars/avt.jpg',
            content: 'Em hiểu rồi ạ. Vậy với ngành Computer Science, chị có thể gợi ý một số trường Match cho em được không ạ?',
            timestamp: new Date(now.getTime() - 1800000),
            isRead: true,
            isMine: true
        },
        {
            id: `${mentorId}-5`,
            senderId: mentorId,
            senderName: mentorName,
            senderAvatar: mentorAvatar,
            content: 'Với CS, em có thể target: Purdue, UIUC, UW-Madison, Wisconsin. Đây đều là trường có chương trình CS mạnh và tỉ lệ nhận phù hợp với profile của em.',
            timestamp: new Date(now.getTime() - 900000),
            isRead: false,
            isMine: false
        }
    ];
};

// Mock Conversations
const CONVERSATIONS: Conversation[] = [
    {
        id: 'conv-as',
        mentor: MENTORS.AS,
        lastMessage: 'Với CS, em có thể target: Purdue, UIUC...',
        lastMessageTime: new Date(Date.now() - 900000),
        unreadCount: 1,
        messages: generateMockMessages(MENTORS.AS.id, MENTORS.AS.name, MENTORS.AS.avatar)
    },
    {
        id: 'conv-acs',
        mentor: MENTORS.ACS,
        lastMessage: 'Bài luận của em đã được review xong, em check email nhé!',
        lastMessageTime: new Date(Date.now() - 7200000),
        unreadCount: 0,
        messages: generateMockMessages(MENTORS.ACS.id, MENTORS.ACS.name, MENTORS.ACS.avatar)
    },
    {
        id: 'conv-ard',
        mentor: MENTORS.ARD,
        lastMessage: 'Chị đã gửi danh sách các cuộc thi phù hợp cho em.',
        lastMessageTime: new Date(Date.now() - 86400000),
        unreadCount: 2,
        messages: generateMockMessages(MENTORS.ARD.id, MENTORS.ARD.name, MENTORS.ARD.avatar)
    },
    {
        id: 'conv-general',
        mentor: MENTORS.GENERAL,
        lastMessage: '[Ms. Holy Ann]: Chào cả nhà! Mọi người có câu hỏi gì...',
        lastMessageTime: new Date(Date.now() - 3600000),
        unreadCount: 5,
        messages: generateMockMessages(MENTORS.GENERAL.id, 'Team Mentor', MENTORS.GENERAL.avatar)
    }
];

// Helper function to get role icon
const getRoleIcon = (roleCode: string) => {
    switch (roleCode) {
        case 'AS':
            return Target;
        case 'ACS':
            return PenTool;
        case 'ARD':
            return Lightbulb;
        case 'GENERAL':
            return Users;
        default:
            return MessageCircle;
    }
};

// Helper function to get role color
const getRoleColor = (roleCode: string) => {
    switch (roleCode) {
        case 'AS':
            return {bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200'};
        case 'ACS':
            return {bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200'};
        case 'ARD':
            return {bg: 'bg-emerald-100', text: 'text-emerald-600', border: 'border-emerald-200'};
        case 'GENERAL':
            return {bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200'};
        default:
            return {bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-200'};
    }
};

// Format time helper
const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Vừa xong';
    if (minutes < 60) return `${minutes} phút`;
    if (hours < 24) return `${hours} giờ`;
    if (days < 7) return `${days} ngày`;
    return date.toLocaleDateString('vi-VN');
};

const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'});
};

// Main Component
export const ChatPage: React.FC = () => {
    const [conversations] = useState<Conversation[]>(CONVERSATIONS);
    const [selectedConversation, setSelectedConversation] = useState<Conversation>(CONVERSATIONS[0]);
    const [messageInput, setMessageInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showMobileInfo, setShowMobileInfo] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [selectedConversation.messages]);

    const handleSendMessage = () => {
        if (!messageInput.trim()) return;

        const newMessage: Message = {
            id: `msg-${Date.now()}`,
            senderId: 'student',
            senderName: 'Bạn',
            senderAvatar: '/images/avatars/avt.jpg',
            content: messageInput,
            timestamp: new Date(),
            isRead: false,
            isMine: true
        };

        // Add message to conversation (in real app, this would be an API call)
        selectedConversation.messages.push(newMessage);
        setMessageInput('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const filteredConversations = conversations.filter(conv =>
        conv.mentor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.mentor.roleTitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const RoleIcon = getRoleIcon(selectedConversation.mentor.roleCode);
    const roleColors = getRoleColor(selectedConversation.mentor.roleCode);

    return (
        <div className="h-[calc(100vh-theme(spacing.16))] bg-gray-50 flex overflow-hidden">

            {/* ========== LEFT SIDEBAR - Conversation List ========== */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
                {/* Header */}
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <MessageCircle className="text-blue-600" size={24}/>
                        Trao Đổi
                    </h2>
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                        <input
                            type="text"
                            placeholder="Tìm kiếm cuộc trò chuyện..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-sm"
                        />
                    </div>
                </div>

                {/* Conversation List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredConversations.map((conv) => {
                        const ConvIcon = getRoleIcon(conv.mentor.roleCode);
                        const convColors = getRoleColor(conv.mentor.roleCode);
                        const isSelected = selectedConversation.id === conv.id;

                        return (
                            <div
                                key={conv.id}
                                onClick={() => setSelectedConversation(conv)}
                                className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                                    isSelected ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    {/* Avatar */}
                                    <div className="relative flex-shrink-0">
                                        <img
                                            src={conv.mentor.avatar}
                                            alt={conv.mentor.name}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                        />
                                        {conv.mentor.isOnline && (
                                            <div
                                                className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"/>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <h3 className={`font-semibold truncate ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                                                {conv.mentor.name}
                                            </h3>
                                            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                                                {formatTime(conv.lastMessageTime)}
                                            </span>
                                        </div>

                                        {/* Role Badge */}
                                        <div className="flex items-center gap-1.5 mb-1.5">
                                            <span
                                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${convColors.bg} ${convColors.text}`}>
                                                <ConvIcon size={12}/>
                                                {conv.mentor.roleCode}
                                            </span>
                                        </div>

                                        {/* Last Message */}
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm text-gray-600 truncate pr-2">
                                                {conv.lastMessage}
                                            </p>
                                            {conv.unreadCount > 0 && (
                                                <span
                                                    className="flex-shrink-0 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                                                    {conv.unreadCount}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ========== MAIN CHAT AREA ========== */}
            <div className="flex-1 flex flex-col bg-white">
                {/* Chat Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <img
                                src={selectedConversation.mentor.avatar}
                                alt={selectedConversation.mentor.name}
                                className="w-11 h-11 rounded-full object-cover border-2 border-gray-100"
                            />
                            {selectedConversation.mentor.isOnline && (
                                <div
                                    className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"/>
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">{selectedConversation.mentor.name}</h3>
                            <div className="flex items-center gap-2">
                                <span
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${roleColors.bg} ${roleColors.text}`}>
                                    <RoleIcon size={12}/>
                                    {selectedConversation.mentor.roleTitle}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {selectedConversation.mentor.isOnline
                                        ? '● Đang hoạt động'
                                        : `Hoạt động ${selectedConversation.mentor.lastSeen}`
                                    }
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                        <button
                            className="p-2.5 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-blue-600">
                            <Phone size={20}/>
                        </button>
                        <button
                            className="p-2.5 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-blue-600">
                            <Video size={20}/>
                        </button>
                        <button
                            onClick={() => setShowMobileInfo(!showMobileInfo)}
                            className="p-2.5 hover:bg-gray-100 rounded-full transition-colors text-gray-600 hover:text-blue-600 lg:hidden">
                            <MoreVertical size={20}/>
                        </button>
                    </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
                    {/* Date Separator */}
                    <div className="flex items-center justify-center">
                        <div className="px-4 py-1.5 bg-gray-100 rounded-full text-xs text-gray-500 font-medium">
                            Hôm nay
                        </div>
                    </div>

                    {/* Messages */}
                    {selectedConversation.messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex items-end gap-2 ${message.isMine ? 'flex-row-reverse' : ''}`}
                        >
                            {!message.isMine && (
                                <img
                                    src={message.senderAvatar}
                                    alt={message.senderName}
                                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                />
                            )}
                            <div className={`max-w-[70%] ${message.isMine ? 'items-end' : 'items-start'}`}>
                                <div
                                    className={`px-4 py-3 rounded-2xl ${
                                        message.isMine
                                            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
                                            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm'
                                    }`}
                                >
                                    <p className="text-sm leading-relaxed">{message.content}</p>
                                </div>
                                <div
                                    className={`flex items-center gap-1 mt-1 ${message.isMine ? 'justify-end' : 'justify-start'}`}>
                                    <span className="text-xs text-gray-400">
                                        {formatMessageTime(message.timestamp)}
                                    </span>
                                    {message.isMine && (
                                        <CheckCheck
                                            size={14}
                                            className={message.isRead ? 'text-blue-500' : 'text-gray-400'}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef}/>
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex items-end gap-3">
                        {/* Attachment Buttons */}
                        <div className="flex items-center gap-1">
                            <button
                                className="p-2.5 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-blue-600">
                                <Paperclip size={20}/>
                            </button>
                            <button
                                className="p-2.5 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-blue-600">
                                <Image size={20}/>
                            </button>
                        </div>

                        {/* Input Field */}
                        <div className="flex-1 relative">
                            <textarea
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Nhập tin nhắn..."
                                rows={1}
                                className="w-full px-4 py-3 bg-gray-100 rounded-2xl border-0 focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none text-sm transition-all"
                                style={{minHeight: '48px', maxHeight: '120px'}}
                            />
                            <button
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                                <Smile size={20}/>
                            </button>
                        </div>

                        {/* Send Button */}
                        <button
                            onClick={handleSendMessage}
                            disabled={!messageInput.trim()}
                            className={`p-3 rounded-full transition-all ${
                                messageInput.trim()
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-blue-500/30 hover:scale-105'
                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                        >
                            <Send size={20}/>
                        </button>
                    </div>
                </div>
            </div>

            {/* ========== RIGHT SIDEBAR - Mentor Info ========== */}
            <div
                className={`w-80 bg-white border-l border-gray-200 flex-col hidden lg:flex ${showMobileInfo ? 'fixed inset-y-0 right-0 z-50 flex shadow-2xl' : ''}`}>
                {/* Mobile Close Button */}
                {showMobileInfo && (
                    <button
                        onClick={() => setShowMobileInfo(false)}
                        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full lg:hidden"
                    >
                        <X size={20}/>
                    </button>
                )}

                {/* Mentor Profile */}
                <div className="p-6 text-center border-b border-gray-200">
                    <div className="relative inline-block mb-4">
                        <img
                            src={selectedConversation.mentor.avatar}
                            alt={selectedConversation.mentor.name}
                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
                        />
                        {selectedConversation.mentor.isOnline && (
                            <div
                                className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-3 border-white"/>
                        )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedConversation.mentor.name}</h3>
                    <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${roleColors.bg} ${roleColors.text}`}>
                        <RoleIcon size={16}/>
                        {selectedConversation.mentor.roleTitle}
                    </span>
                </div>

                {/* Role Description */}
                <div className="p-4 border-b border-gray-200">
                    <h4 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                        <BookOpen size={16} className="text-blue-600"/>
                        Vai trò & Trách nhiệm
                    </h4>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        {selectedConversation.mentor.description}
                    </p>
                </div>

                {/* Achievements */}
                <div className="p-4 border-b border-gray-200">
                    <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <Award size={16} className="text-yellow-500"/>
                        Thành tựu nổi bật
                    </h4>
                    <ul className="space-y-2">
                        {selectedConversation.mentor.achievements.map((achievement, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                <Star size={14} className="text-yellow-500 mt-0.5 flex-shrink-0"/>
                                {achievement}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Quick Actions */}
                <div className="p-4 border-b border-gray-200">
                    <h4 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                        <Sparkles size={16} className="text-purple-500"/>
                        Thao tác nhanh
                    </h4>
                    <div className="space-y-2">
                        <button
                            className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group">
                            <span className="flex items-center gap-2 text-sm text-gray-700">
                                <FileText size={16} className="text-blue-500"/>
                                Xem file đã gửi
                            </span>
                            <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600"/>
                        </button>
                        <button
                            className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group">
                            <span className="flex items-center gap-2 text-sm text-gray-700">
                                <Clock size={16} className="text-orange-500"/>
                                Đặt lịch hẹn
                            </span>
                            <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600"/>
                        </button>
                        <button
                            className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group">
                            <span className="flex items-center gap-2 text-sm text-gray-700">
                                <GraduationCap size={16} className="text-green-500"/>
                                Xem hồ sơ Mentor
                            </span>
                            <ChevronRight size={16} className="text-gray-400 group-hover:text-gray-600"/>
                        </button>
                    </div>
                </div>

                {/* Role Legend */}
                <div className="p-4 mt-auto">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 tracking-wider">
                        Giải thích vai trò Mentor
                    </h4>
                    <div className="space-y-2 text-xs">
                        <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                            <Target size={14} className="text-blue-600"/>
                            <div>
                                <span className="font-semibold text-blue-700">AS</span>
                                <span className="text-blue-600 ml-1">- Chiến lược gia</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                            <PenTool size={14} className="text-purple-600"/>
                            <div>
                                <span className="font-semibold text-purple-700">ACS</span>
                                <span className="text-purple-600 ml-1">- Biên tập luận</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg">
                            <Lightbulb size={14} className="text-emerald-600"/>
                            <div>
                                <span className="font-semibold text-emerald-700">ARD</span>
                                <span className="text-emerald-600 ml-1">- Phát triển Profile</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;

