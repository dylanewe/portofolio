export interface Skill {
  name: string;
  icon: string[][];
  iconColors: Record<string, string>;
  proficiency: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  tags: string[];
  liveUrl?: string;
  sourceUrl?: string;
  longDescription?: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  fork: boolean;
  topics: string[];
}

export interface SocialLink {
  name: string;
  url: string;
  icon: 'github' | 'linkedin' | 'twitter' | 'dribbble' | 'email';
}
