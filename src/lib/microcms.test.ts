// src/lib/microcms.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockGetList = vi.fn();
const mockGetListDetail = vi.fn();

vi.mock('microcms-js-sdk', () => ({
  createClient: vi.fn(() => ({
    getList: mockGetList,
    getListDetail: mockGetListDetail,
  })),
}));

const { getNewsList, getNewsDetail, getAllNewsSlugs } = await import('./microcms');

describe('getNewsList', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('publishedAtの降順で最大10件を取得する', async () => {
    mockGetList.mockResolvedValue({
      contents: [{
        id: 'news-1',
        title: 'テストニュース',
        body: '<p>本文</p>',
        publishedAt: '2026-07-20T00:00:00.000Z',
      }],
      totalCount: 1,
    });

    const result = await getNewsList();

    expect(mockGetList).toHaveBeenCalledWith({
      endpoint: 'news',
      queries: { orders: '-publishedAt', limit: 10 },
    });
    expect(result.contents[0].title).toBe('テストニュース');
  });

  it('limit引数を渡すと件数が変わる', async () => {
    mockGetList.mockResolvedValue({ contents: [], totalCount: 0 });
    await getNewsList(3);
    expect(mockGetList).toHaveBeenCalledWith({
      endpoint: 'news',
      queries: { orders: '-publishedAt', limit: 3 },
    });
  });
});

describe('getNewsDetail', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('指定したcontentIdの記事を取得する', async () => {
    const mockNews = {
      id: 'news-abc',
      title: '詳細記事',
      body: '<p>詳細本文</p>',
      publishedAt: '2026-07-20T00:00:00.000Z',
    };
    mockGetListDetail.mockResolvedValue(mockNews);

    const result = await getNewsDetail('news-abc');

    expect(mockGetListDetail).toHaveBeenCalledWith({
      endpoint: 'news',
      contentId: 'news-abc',
    });
    expect(result.id).toBe('news-abc');
  });
});

describe('getAllNewsSlugs', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it('全記事のidの配列を返す', async () => {
    mockGetList.mockResolvedValue({
      contents: [{ id: 'slug-1' }, { id: 'slug-2' }],
      totalCount: 2,
    });

    const result = await getAllNewsSlugs();

    expect(mockGetList).toHaveBeenCalledWith({
      endpoint: 'news',
      queries: { fields: 'id', limit: 100 },
    });
    expect(result).toEqual(['slug-1', 'slug-2']);
  });
});

describe('環境変数が未設定のとき', () => {
  it('読み込み時には失敗せず、取得時にエラーになる（呼び出し側の仮データ表示に任せる）', async () => {
    vi.resetModules();
    const sdk = await import('microcms-js-sdk');
    vi.mocked(sdk.createClient).mockImplementationOnce(() => {
      throw new Error('parameter is required (check serviceDomain and apiKey)');
    });

    const mod = await import('./microcms');

    await expect(mod.getNewsList()).rejects.toThrow('parameter is required');
  });
});
