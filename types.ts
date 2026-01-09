export interface HistoricalEvent {
  year: number;
  title: string;
  description: string;
  category: 'War' | 'Politics' | 'Science' | 'Culture' | 'General';
}

export interface EventDetailData {
  summary: string;
  bulletPoints: string[];
  wikipediaTopic: string;
  relatedLinks: Array<{ title: string; url: string }>;
}

export interface DateObj {
  month: string;
  day: number;
}
