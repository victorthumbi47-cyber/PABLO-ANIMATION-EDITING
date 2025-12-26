
export enum View {
  LANDING = 'LANDING',
  AUTH = 'AUTH',
  DASHBOARD = 'DASHBOARD',
  OWNER_DASHBOARD = 'OWNER_DASHBOARD',
  EDITOR = 'EDITOR',
  PROCESSING = 'PROCESSING',
  EXPORT = 'EXPORT',
  PAYMENT = 'PAYMENT'
}

export type UserRole = 'USER' | 'OWNER';

export interface User {
  name: string;
  email: string;
  role: UserRole;
  isPremium?: boolean;
}

export interface Project {
  id: string;
  name: string;
  thumbnail: string;
  duration: string;
  status: 'Rendered' | 'Draft' | 'Processing' | 'Exported';
  style: string;
  date: string;
}

export interface StyleOption {
  id: string;
  name: string;
  description: string;
  image: string;
  badge?: string;
}

export interface Folder {
  id: string;
  name: string;
}

export interface Asset {
  id: string;
  url: string;
  name: string;
  duration: string;
  status: 'ready' | 'uploading' | 'ai-generated';
  type: 'video' | 'image';
  folderId?: string;
}
