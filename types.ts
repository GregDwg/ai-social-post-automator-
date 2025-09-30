
export interface Article {
  title: string;
  url: string;
  imageUrl?: string;
  summary?: string;
}

export enum SocialPlatform {
  Twitter = 'Twitter',
  LinkedIn = 'LinkedIn',
  Facebook = 'Facebook',
}
