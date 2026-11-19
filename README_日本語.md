# 今日なに作る？ — Cloudflare Pages starter

## できること
- レシピ紹介カードを表示
- ジャンル・キーワードで絞り込み
- 外部レシピへのリンククリックを日別集計
- 当日のクリック数順にランキング表示
- 日付が変わると自動的に新しい日の集計へ切り替え

## 大事な仕様
このランキングは「このサイトから外部リンクをクリックした回数」です。外部レシピサイト全体のアクセス数ではありません。
サンプルのリンク先は検索ページです。公開前に、紹介したいレシピの個別ページURLと、利用許諾・リンク条件を確認して差し替えてください。外部サイトの写真・本文を許可なくコピーしないでください。

## Cloudflareでの公開手順
1. Cloudflareにログインし、Workers & Pages から Pages プロジェクトを作成します。
2. このZIPを展開し、GitHubにアップロードしてPagesと接続する方法が簡単です（GitHubアカウントが必要）。
3. CloudflareのD1で `kyounani-tsukuru-db` というデータベースを作成します。
4. D1のConsoleで `schema.sql` の内容を実行します。
5. Pagesプロジェクトの Settings > Functions > D1 database bindings で Variable name を `DB`、Databaseを作成したDBに設定します。
6. Pagesの Build settings は Framework preset: None、Build command: 空欄、Build output directory: `/`（またはプロジェクトのルート）にします。
7. 再デプロイします。

## レシピを追加・編集する
`recipes.json` に項目を追加します。idは英数字とハイフンで一意にしてください。
追加したidは `functions/api/track.js` の ALLOWED にも追加してください。
タイトル・説明文は独自に作成し、外部リンクは正規の掲載先URLに差し替えます。

## 注意
- 集計日はAsia/Tokyo（日本時間）基準です。
- 不正クリック対策、Bot除外、アクセス解析のプライバシー表示は公開前に追加を検討してください。
- D1の無料枠・Cloudflareの仕様は変更される場合があります。
