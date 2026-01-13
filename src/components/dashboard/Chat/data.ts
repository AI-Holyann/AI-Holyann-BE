import { Mentor, Message, Conversation } from "./types";

// Mock Data - Mentors
export const MENTORS: Record<string, Mentor> = {
  AS: {
    id: "mentor-as",
    name: "Ms. Holy Ann",
    roleCode: "AS",
    roleTitle: "Admission Strategist",
    description:
      "Chịu trách nhiệm lên chiến lược tổng thể, định hướng chọn trường và ngành phù hợp với profile của học sinh.",
    achievements: [
      "5 năm kinh nghiệm tư vấn",
      "Mentor 20+ học sinh đỗ Ivy League",
      "Chuyên gia scholarship hunting",
    ],
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    isOnline: true,
  },
  ACS: {
    id: "mentor-acs",
    name: "Mr. David Nguyen",
    roleCode: "ACS",
    roleTitle: "Application Content Specialist",
    description:
      "Chuyên gia biên tập nội dung hồ sơ, review và hướng dẫn viết luận (Personal Statement, Supplemental Essays).",
    achievements: [
      "Biên tập 500+ bài luận thành công",
      "Cựu Admission Officer",
      'Tác giả sách "Essay that Wins"',
    ],
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    isOnline: true,
  },
  ARD: {
    id: "mentor-ard",
    name: "Ms. Linh Tran",
    roleCode: "ARD",
    roleTitle: "Application Research & Development",
    description:
      "Phát triển Profile học sinh qua các hoạt động ngoại khóa, nghiên cứu và dự án cộng đồng có chiều sâu.",
    achievements: [
      "Thiết kế 100+ hoạt động ngoại khóa",
      "Chuyên gia STEM research",
      "Kết nối với 50+ tổ chức quốc tế",
    ],
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    isOnline: false,
    lastSeen: "2 giờ trước",
  },
  GENERAL: {
    id: "mentor-general",
    name: "Box Chung",
    roleCode: "GENERAL",
    roleTitle: "Group Discussion",
    description:
      "Không gian thảo luận chung với tất cả các Mentor. Đặt câu hỏi và nhận tư vấn từ đội ngũ chuyên gia.",
    achievements: [
      "Hỗ trợ 24/7",
      "Phản hồi trong 24h",
      "Cộng đồng học sinh năng động",
    ],
    avatar:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=150&fit=crop",
    isOnline: true,
  },
};

// Mock Messages
export const generateMockMessages = (
  mentorId: string,
  mentorName: string,
  mentorAvatar: string
): Message[] => {
  const now = new Date();
  return [
    {
      id: `${mentorId}-1`,
      senderId: mentorId,
      senderName: mentorName,
      senderAvatar: mentorAvatar,
      content:
        "Chào em! Chị đã xem qua hồ sơ của em rồi. Em có câu hỏi gì không?",
      timestamp: new Date(now.getTime() - 3600000 * 2),
      isRead: true,
      isMine: false,
    },
    {
      id: `${mentorId}-2`,
      senderId: "student",
      senderName: "Bạn",
      senderAvatar: "/images/avatars/avt.jpg",
      content:
        "Dạ chào chị! Em muốn hỏi về chiến lược chọn trường cho mùa apply năm nay ạ.",
      timestamp: new Date(now.getTime() - 3600000 * 1.5),
      isRead: true,
      isMine: true,
    },
    {
      id: `${mentorId}-3`,
      senderId: mentorId,
      senderName: mentorName,
      senderAvatar: mentorAvatar,
      content:
        "Tốt lắm! Với profile hiện tại của em (GPA 3.8, SAT 1480), chị nghĩ em nên cân nhắc danh sách 8-10 trường theo tỉ lệ: 2 Dream, 4 Match, 2 Safety.",
      timestamp: new Date(now.getTime() - 3600000),
      isRead: true,
      isMine: false,
    },
    {
      id: `${mentorId}-4`,
      senderId: "student",
      senderName: "Bạn",
      senderAvatar: "/images/avatars/avt.jpg",
      content:
        "Em hiểu rồi ạ. Vậy với ngành Computer Science, chị có thể gợi ý một số trường Match cho em được không ạ?",
      timestamp: new Date(now.getTime() - 1800000),
      isRead: true,
      isMine: true,
    },
    {
      id: `${mentorId}-5`,
      senderId: mentorId,
      senderName: mentorName,
      senderAvatar: mentorAvatar,
      content:
        "Với CS, em có thể target: Purdue, UIUC, UW-Madison, Wisconsin. Đây đều là trường có chương trình CS mạnh và tỉ lệ nhận phù hợp với profile của em.",
      timestamp: new Date(now.getTime() - 900000),
      isRead: false,
      isMine: false,
    },
  ];
};

// Mock Conversations
export const CONVERSATIONS: Conversation[] = [
  {
    id: "conv-as",
    mentor: MENTORS.AS,
    lastMessage: "Với CS, em có thể target: Purdue, UIUC...",
    lastMessageTime: new Date(Date.now() - 900000),
    unreadCount: 1,
    messages: generateMockMessages(
      MENTORS.AS.id,
      MENTORS.AS.name,
      MENTORS.AS.avatar
    ),
  },
  {
    id: "conv-acs",
    mentor: MENTORS.ACS,
    lastMessage: "Bài luận của em đã được review xong, em check email nhé!",
    lastMessageTime: new Date(Date.now() - 7200000),
    unreadCount: 0,
    messages: generateMockMessages(
      MENTORS.ACS.id,
      MENTORS.ACS.name,
      MENTORS.ACS.avatar
    ),
  },
  {
    id: "conv-ard",
    mentor: MENTORS.ARD,
    lastMessage: "Chị đã gửi danh sách các cuộc thi phù hợp cho em.",
    lastMessageTime: new Date(Date.now() - 86400000),
    unreadCount: 2,
    messages: generateMockMessages(
      MENTORS.ARD.id,
      MENTORS.ARD.name,
      MENTORS.ARD.avatar
    ),
  },
  {
    id: "conv-general",
    mentor: MENTORS.GENERAL,
    lastMessage: "[Ms. Holy Ann]: Chào cả nhà! Mọi người có câu hỏi gì...",
    lastMessageTime: new Date(Date.now() - 3600000),
    unreadCount: 5,
    messages: generateMockMessages(
      MENTORS.GENERAL.id,
      "Team Mentor",
      MENTORS.GENERAL.avatar
    ),
  },
];
