import {
  MessageCircle,
  Target,
  PenTool,
  Lightbulb,
  Users,
} from "lucide-react";

// Helper function to get role icon
export const getRoleIcon = (roleCode: string) => {
  switch (roleCode) {
    case "AS":
      return Target;
    case "ACS":
      return PenTool;
    case "ARD":
      return Lightbulb;
    case "GENERAL":
      return Users;
    default:
      return MessageCircle;
  }
};

// Helper function to get role color
export const getRoleColor = (roleCode: string) => {
  switch (roleCode) {
    case "AS":
      return {
        bg: "bg-blue-100",
        text: "text-blue-600",
        border: "border-blue-200",
      };
    case "ACS":
      return {
        bg: "bg-purple-100",
        text: "text-purple-600",
        border: "border-purple-200",
      };
    case "ARD":
      return {
        bg: "bg-emerald-100",
        text: "text-emerald-600",
        border: "border-emerald-200",
      };
    case "GENERAL":
      return {
        bg: "bg-orange-100",
        text: "text-orange-600",
        border: "border-orange-200",
      };
    default:
      return {
        bg: "bg-gray-100",
        text: "text-gray-600",
        border: "border-gray-200",
      };
  }
};

// Format time helper
export const formatTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút`;
  if (hours < 24) return `${hours} giờ`;
  if (days < 7) return `${days} ngày`;
  return date.toLocaleDateString("vi-VN");
};

export const formatMessageTime = (date: Date) => {
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
