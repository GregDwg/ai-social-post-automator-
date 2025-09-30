export interface Article {
  title: string;
  url: string;
  imageBase64?: string;
  summary?: string;
}

export enum SocialPlatform {
  Twitter = 'Twitter',
  LinkedIn = 'LinkedIn',
  Facebook = 'Facebook',
  Threads = 'Threads',
}