export interface chatMessage {
  id: number;
  senderId: string;
  content: string;
  createdAt: string;
  receiverId: string;
  isRead: boolean | null;
  isReadTime: string | null;
}
export interface lastMessageModel {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  receiverId: string;
  isRead: boolean | null;
  IsReadTime: string | null;
}
export interface currentLastMessageModel {
  isRead: boolean;
  isReadTime: string;
}
