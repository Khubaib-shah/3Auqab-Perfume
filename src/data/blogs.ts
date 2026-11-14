export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  author: string;
  authorRole: string;
  authorAvatar: string;
  views: number;
  commentsCount: number;
  image: string;
  sliderThumb?: string;
  sidebarThumb?: string;
  excerpt: string;
  content: string[];
  quote: string;
  tags: string[];
}
