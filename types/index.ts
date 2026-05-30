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
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Startup {
  id: string;
  founder_id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  logo_url: string | null;
  cover_url: string | null;
  website_url: string | null;
  category: string | null;
  stage: StartupStage | null;
  founded_year: number | null;
  location: string;
  lga: string | null;
  is_hiring: boolean;
  status: StartupStatus;
  tags: string[];
  social_links: Record<string, string>;
  view_count: number;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  products?: StartupProduct[];
}

export interface StartupProduct {
  id: string;
  startup_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price: number | null;
  currency: string;
  created_at: string;
}

export interface Organization {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  logo_url: string | null;
  cover_url: string | null;
  website_url: string | null;
  org_type: OrgType | null;
  lga: string | null;
  founded_year: number | null;
  status: StartupStatus;
  tags: string[];
  social_links: Record<string, string>;
  view_count: number;
  created_at: string;
  updated_at: string;
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
