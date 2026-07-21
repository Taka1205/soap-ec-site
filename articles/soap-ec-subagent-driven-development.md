---
title: "Claude Codeの subagent-driven-development で実サイトを1機能ずつ作らせてみた"
emoji: "🤖"
type: "tech"
topics: ["claudecode", "ai", "astro", "個人開発", "生成AI"]
published: false
---

## はじめに

[前回の記事](https://zenn.dev/xxx/articles/soap-ec-tech-selection)では、石鹸ブランドサイトの技術選定（Astro + microCMS + Cloudflare Pages）について書きました。今回はその中身、つまり「実際にどうやって作ったか」の話です。

今回のサイトはすべてClaude Codeで実装しました。使ったのは `superpowers` プラグインの `subagent-driven-development`（以下sdd）というスキルです。

この構成を試すきっかけになったのは、[「Claude Codeが化けた。今使っている3つのプラグイン+標準機能の活用法」](https://zenn.dev/sonicmoov/articles/8712598f532b18) という記事でした。ステータスライン・genshijin・dig・superpowersといった拡張機能の組み合わせが紹介されており、これを自分のプロジェクトでも試してみたいと思ったのが出発点です。本記事ではその中でも `subagent-driven-development` に絞って、実際のブランドサイト構築でどう機能したかを記録します。

## subagent-driven-developmentとは

sddは一言でいうと、**「実装計画をタスク単位に分割し、タスクごとにサブエージェントへ実装を任せ、都度レビューして進捗台帳に記録する」**という開発フローです。1つの巨大なセッションに全部詰め込むのではなく、

1. 実装計画（plan）をタスクに分解する
2. タスクごとに「brief」（指示書）を作る
3. サブエージェントがbriefに沿って実装し、「report」（完了報告）を返す
4. 直前のタスクとの差分（diff）を別途レビューする
5. 結果を「progress ledger」に記録し、次のタスクへ進む

という単位でループを回します。1タスクごとに実装・確認・記録が閉じるので、後から「どのタスクで何が起きたか」を追いやすいのが特徴です。

## 実際の運用例

今回のサイトは、事前に作った実装計画（`docs/superpowers/plans/2026-07-20-soap-ec-site-phase1.md`）をもとに、以下の9タスクに分割しました。

| Task | 内容 |
|---|---|
| 1 | プロジェクトセットアップ |
| 2 | MicroCMS APIクライアント（TDD） |
| 3 | BaseLayout + Header + Footer |
| 4 | homeページ |
| 5 | aboutページ |
| 6 | NewsCard + news一覧ページ |
| 7 | news詳細ページ |
| 8 | Webhook → Cloudflare自動ビルド設定（手動作業） |
| 9 | 更新者のCloudflare権限設定（手動作業） |

コードが絡むTask1〜7はすべてsddで、Task8・9はCloudflareのダッシュボード操作を伴うため手動作業として切り分けています。「どこまでをAIに任せ、どこから先は人間がやるか」をタスク単位で明確に線引きできるのも、細かくタスク分割しておくメリットだと感じました。

### briefの中身

各タスクのbriefには、作成/変更するファイル、実装すべきインターフェース、そして具体的な実装コードとステップが書かれています。例えばTask6（NewsCard + news一覧ページ）のbriefは、こんな粒度です。

```markdown
### Task 6: NewsCard + news一覧ページ

**Files:**
- Create: `src/components/NewsCard.astro`
- Create: `src/pages/news/index.astro`

**Interfaces:**
- Consumes: `getNewsList(20)` → `{ contents: News[] }`
- Produces:
  - `<NewsCard news={News} />` コンポーネント
  - `/news` 一覧ページ

- [ ] **Step 1: NewsCard.astro を作成する**
...(具体的なコード)...

- [ ] **Step 3: 開発サーバーで確認する**
- [ ] **Step 4: コミットする**
```

コードそのものがbriefにほぼ書かれているので、実装の自由度は高くありません。裏を返せば、「設計判断は計画段階で済ませておき、実装フェーズでは迷わせない」という役割分担になっています。

### reportの中身

実装後は、サブエージェントが completion report を返します。Task6のreportは以下のような構成でした。

```markdown
# Task 6: NewsCard + news一覧ページ — Completion Report

## Status: DONE

### Files Created
1. src/components/NewsCard.astro (49 lines)
   ...
2. src/pages/news/index.astro (120 lines)
   ...

### Build Verification
✓ npm run build completed successfully
  - 3 pages built (about, index, news)
  - No TypeScript errors
  - Build time: 649ms

### QA Checklist
- [x] Component accepts News type correctly
- [x] Mock fallback works when getNewsList fails
- [x] Responsive grid displays 1/2/3 columns as specified
- [x] Build completes without errors
- [x] Commit includes both files
```

ビルド結果・QAチェックリスト・コミットハッシュまでセットで返ってくるので、レビュー担当（自分）は「何を確認すればいいか」がreportを読むだけで分かります。

## レビューの仕組み

sddのもう一つの柱が、タスクごとの差分レビューです。各タスク完了後、直前のコミットからの diff だけを切り出したレビューパッケージ（`review-<from>..<to>.diff`）が作られ、それを見て良し悪しを判断します。

判断結果は `progress.md` という進捗台帳に1行ずつ蓄積していきます。実際のログはこんな感じでした。

```markdown
## Task 3: BaseLayout + Header + Footer — COMPLETE
commits: fa58b5e..4c92f64, review clean
Minor notes:
- og:url メタタグ未設定（ブリーフ自体の未記載、後で追加推奨）
- Header のアクティブ判定は trailingSlash 設定依存（現状問題なし）

## Task 6: NewsCard + news一覧ページ — COMPLETE
commits: a4f119f..4ac23a2, review clean
```

「review clean（問題なし）」で終わるタスクもあれば、Task3のように軽微な指摘（og:urlの設定漏れなど）が記録されるタスクもありました。この指摘は最終的に、全タスク完了後の**最終ブランチレビュー**（コミット `8cdc5a2`）でまとめて拾って修正しています。

```markdown
## 最終ブランチレビュー — COMPLETE
commits: b17bbdb..8cdc5a2
修正済み: mock-3 404, og:url, nav active state, news meta description
```

タスク単位のレビューで「今の範囲では問題ない」と流した軽微な指摘が、後工程できちんと拾われて解消される。この2段構えのチェック体制は、実際にやってみて良かったと感じたポイントです。

## 良かった点・つまずいた点

**良かった点**

- **タスクの切れ目が明確**なので、途中で作業を中断しても「どこまで終わったか」が `progress.md` を見れば一目瞭然だった
- **diffだけをレビューする**運用のおかげで、9タスク分の変更を1つの巨大なPRとして読む必要がなく、レビュー負荷が小さかった
- **手動作業（Task8・9のCloudflare設定）を計画の中に明示的に組み込めた**ことで、「AIにやらせる範囲」と「人間がやる範囲」の境界が曖昧にならなかった

**つまずいた点**

- briefの粒度をどこまで細かく書くかの見極めが最初は難しかった。Task2（MicroCMSクライアント）はTDDで書いたテストコードごとbriefに含めたが、コードを書きすぎるとサブエージェントの裁量がほぼゼロになり、「指示書を写経してもらっているだけ」に近くなる場面もあった
- タスク単位のレビューで「現状問題なし」と流した指摘（Header のアクティブ判定など）が、最終レビューまで持ち越しになる。持ち越しリスト自体はprogress.mdに残るので実害はなかったが、件数が多いプロジェクトだと最終レビューが重くなりそうな懸念はある

## まとめ

subagent-driven-developmentは、実装計画さえきちんと立てられていれば、「タスクを渡す→実装される→diffを見る→記録する」というループを淡々と回すだけで、規模のあるサイトも1機能ずつ着実に積み上げられる開発フローでした。特に今回のような「ページ数は多いが、1ページごとの複雑度はそこまで高くない」タイプのプロジェクト（LP、コーポレートサイト、ドキュメントサイトなど）とは相性が良いと感じています。

逆に、タスク間の依存関係が複雑で「実装しながら設計を調整する」必要が大きいプロジェクトでは、briefを書く段階でのコスト（≒設計コスト）が相対的に重くなるはずなので、その場合は別のワークフロー（brainstormingで先に仕様を詰め切る、など）と組み合わせるのが良さそうです。
