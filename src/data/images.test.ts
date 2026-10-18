// src/data/images.test.ts
import { describe, it, expect } from 'vitest';
import { newsImage, newsFallbackImages } from './images';

describe('newsImage', () => {
  it('アイキャッチがあればそれを使う', () => {
    const eyecatch = { url: 'https://images.microcms-assets.io/a.jpg', width: 1200, height: 800 };
    expect(newsImage({ id: 'news-1', eyecatch })).toEqual({ src: eyecatch.url, width: 1200, height: 800 });
  });

  it('アイキャッチがなければ作品写真から選ぶ', () => {
    const img = newsImage({ id: 'news-1' });
    expect(newsFallbackImages.map((i) => i.src)).toContain(img.src);
  });

  it('同じ記事には毎回同じ写真を選ぶ', () => {
    expect(newsImage({ id: 'abc' }).src).toBe(newsImage({ id: 'abc' }).src);
  });

  it('記事が違えば別の写真になりやすい', () => {
    const srcs = new Set(['mock-1', 'mock-2', 'mock-3'].map((id) => newsImage({ id }).src));
    expect(srcs.size).toBe(3);
  });
});
