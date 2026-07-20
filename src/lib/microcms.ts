// src/lib/microcms.ts
import { createClient } from 'microcms-js-sdk';

export type News = {
  id: string;
  title: string;
  body: string;
  eyecatch?: { url: string; width: number; height: number };
  publishedAt: string;
};

type NewsListResponse = {
  contents: News[];
  totalCount: number;
  offset: number;
  limit: number;
};

const client = createClient({
  serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN ?? '',
  apiKey: import.meta.env.MICROCMS_API_KEY ?? '',
});

export async function getNewsList(limit = 10): Promise<NewsListResponse> {
  return client.getList<News>({
    endpoint: 'news',
    queries: { orders: '-publishedAt', limit },
  });
}

export async function getNewsDetail(contentId: string): Promise<News> {
  return client.getListDetail<News>({
    endpoint: 'news',
    contentId,
  });
}

export async function getAllNewsSlugs(): Promise<string[]> {
  const { contents } = await client.getList<News>({
    endpoint: 'news',
    queries: { fields: 'id', limit: 100 },
  });
  return contents.map((item) => item.id);
}
