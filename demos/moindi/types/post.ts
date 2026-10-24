export type PostType = "text" | "release" | "product";
// future adds:
// "project-update", "image", "link"

export interface LinkInterface {
  url: string;
  title?: string;
  description?: string;
  imageSrc?: string;
}

export interface EditHistoryInterface {
  content: string;
  createdAt: Date;
}

export interface PostInterface {
  id: string;
  isDeleted?: boolean;
  type: PostType;
  likes: string[]; // userIds
  userId: string;
  content: string;
  profileSrcSet: string;
  userName: string;
  feedUserId: string;
  contentHistory?: EditHistoryInterface[];
  // store edited separately to show "edited" badge
  // latest edit goes in 'content'
  // previous edits go in 'contentHistory'

  imageSrcSet?: string;
  projectId?: string;
  // if it's a project update post

  link?: LinkInterface;
  // scrape metadata upon post creation for preview + storage

  productId?: string;
  releaseId?: string;

  createdAt: Date;
  updatedAt: Date;
}
