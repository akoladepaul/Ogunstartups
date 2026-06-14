export type UserRole = "founder" | "admin" | "viewer";

export type StartupStatus = "pending" | "approved" | "rejected" | "archived";

export type StartupStage = "idea" | "mvp" | "growth" | "scale";

export type OrgType =
  | "accelerator"
  | "incubator"
  | "coworking"
  | "angel_network"
  | "government_agency"
  | "ngo"
  | "university_hub"
  | "corporate_program";

export interface Profile {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface Startup {
  id: string;
  founderId: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
  websiteUrl: string | null;
  category: string | null;
  stage: StartupStage | null;
  foundedYear: number | null;
  location: string;
  lga: string | null;
  isHiring: boolean;
  isFeatured: boolean;
  status: StartupStatus;
  tags: string[];
  socialLinks: Record<string, string>;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  founder?: Profile;
  products?: StartupProduct[];
}

export interface StartupProduct {
  id: string;
  startupId: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  price: number | null;
  currency: string;
  createdAt: Date;
}

export interface Organization {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  logoUrl: string | null;
  coverUrl: string | null;
  websiteUrl: string | null;
  orgType: OrgType | null;
  lga: string | null;
  foundedYear: number | null;
  status: StartupStatus;
  tags: string[];
  socialLinks: Record<string, string>;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface FilterOptions {
  category?: string;
  stage?: string;
  lga?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}
