export interface CommentInterface {
  id: string;
  isDeleted?: boolean;
  likes: string[]; // userIds
  userId: string;
  profileSrcSet: string;
  userName: string;
  content: string;
  credits: number;
  pinned?: boolean;
  createdAt: Date;
}
