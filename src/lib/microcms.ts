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

// 初回利用時に生成する。環境変数が未設定でもモジュールの読み込みでは失敗させず、
// 各ページの try/catch（仮データ表示）でエラーを扱えるようにするため
let client: ReturnType<typeof createClient> | undefined;
function getClient() {
  client ??= createClient({
    serviceDomain: import.meta.env.MICROCMS_SERVICE_DOMAIN ?? '',
    apiKey: import.meta.env.MICROCMS_API_KEY ?? '',
  });
  return client;
}

export async function getNewsList(limit = 10): Promise<NewsListResponse> {
  return getClient().getList<News>({
    endpoint: 'news',
    queries: { orders: '-publishedAt', limit },
  });
}

export async function getNewsDetail(contentId: string): Promise<News> {
  return getClient().getListDetail<News>({
    endpoint: 'news',
    contentId,
  });
}

export async function getAllNewsSlugs(): Promise<string[]> {
  const { contents } = await getClient().getList<News>({
    endpoint: 'news',
    queries: { fields: 'id', limit: 100 },
  });
  return contents.map((item) => item.id);
}
