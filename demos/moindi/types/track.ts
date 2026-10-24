export interface TrackInterface {
  id: string;
  title: string;
  audioUrl: string;
  durationSeconds: number;
  artistId: string;
  releaseId?: string;
  feat?: string;
  uploadedAt: Date;
}
