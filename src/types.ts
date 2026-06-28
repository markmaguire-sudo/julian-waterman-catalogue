export interface Collection {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
}

export interface Artwork {
  id: string;
  title: string;
  description: string;
  year: string;
  medium: string;
  dimensions: string;
  collectionId: string;
  image: string; // Base64 or URL
  isFeatured: boolean;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

export interface Stats {
  totalArtworks: number;
  totalCollections: number;
  totalMessages: number;
  unreadMessages: number;
}
