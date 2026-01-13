// Types for Chat components
export interface Mentor {
  id: string;
  name: string;
  roleCode: "AS" | "ACS" | "ARD" | "GENERAL";
  roleTitle: string;
  description: string;
  achievements: string[];
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  isMine: boolean;
}

export interface Conversation {
  id: string;
  mentor: Mentor;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: Message[];
}
