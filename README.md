# Mugi - Note.com Auto Publisher

GitHub Actionsを使用してnote.comに記事を自動投稿するリポジトリです。

## 📋 目次

1. [クイックスタート](#-クイックスタート)
2. [ディレクトリ構造](#-ディレクトリ構造)
3. [詳細なセットアップ](#-詳細なセットアップ)
4. [記事の作成と投稿](#-記事の作成と投稿)
5. [Markdown記法](#-サポートされるmarkdown記法)
6. [トラブルシューティング](#-トラブルシューティング)
7. [FAQ](#-よくある質問)

---

## 🚀 クイックスタート

最速で始める3ステップ（所要時間: 約10分）

### ステップ1: 認証情報を取得（5分）

```bash
# リポジトリをクローン
git clone https://github.com/YOUR_USERNAME/github-actions-mugi.git
cd github-actions-mugi

# 依存関係とブラウザをインストール
npm install
npm run install-browser

# note.comにログイン
npm run login
# → ブラウザが開くのでログイン → Enterキー
# → プロジェクトルートに .note-state.json が作成される
```

⚠️ `.note-state.json` は `.gitignore` で除外されているのでGitにコミットされません。

### ステップ2: GitHubシークレットを設定（2分）

```bash
# 認証情報をクリップボードにコピー
cat .note-state.json | pbcopy  # macOS
# または
cat .note-state.json  # 内容を手動でコピー
```

GitHubで設定：
1. リポジトリの **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** をクリック
3. Name: `NOTE_STATE_JSON`
4. Secret: 上記でコピーした内容を貼り付け
5. **Add secret** をクリック

### ステップ3: 記事を投稿（3分）

1. GitHubリポジトリの **Actions** タブを開く
2. **Note Post via MCP** ワークフローを選択
3. **Run workflow** をクリック
4. パラメータ入力：
   - **target_folder**: `exsample`
   - **post_type**: `draft`
   - **thumbnail_name**: `sample-thumbnail.png`
5. **Run workflow** をクリック

✅ 完了！note.comの下書き一覧を確認してください。

---

## 📁 ディレクトリ構造

```
github-actions-mugi/
├── .github/
│   └── workflows/
│       └── note-post.yaml          # GitHub Actionsワークフロー
├── note/
│   ├── exsample/                   # サンプル記事フォルダ
│   │   ├── example.md              # 記事本文（Markdown）
│   │   ├── sample-thumbnail.png    # サムネイル画像
│   │   ├── note-view-like.png      # 本文中の画像
│   │   └── donuts-pop.png          # 本文中の画像
│   └── (your-articles)/            # 新しい記事フォルダを追加
├── src/
│   └── login-note.js               # 認証情報取得スクリプト
├── prompts/
│   └── personality-mugi.md         # プロンプト
├── package.json                    # npm設定
├── .gitignore                      # Git除外設定
└── .note-state.json                # 認証情報（Gitにコミットされない）
```

---

## 🔧 詳細なセットアップ

### 前提条件

- **note.comアカウント**: ログイン可能なアカウント
- **GitHubアカウント**: リポジトリとActions使用可能
- **Node.js 18以上**: ローカル環境（認証情報取得用）

### ローカル環境のセットアップ

#### 1. リポジトリのクローン

```bash
# HTTPSでクローン
git clone https://github.com/YOUR_USERNAME/github-actions-mugi.git
cd github-actions-mugi

# または、SSHでクローン
git clone git@github.com:YOUR_USERNAME/github-actions-mugi.git
cd github-actions-mugi
```

#### 2. 依存関係のインストール

```bash
# Node.jsのバージョン確認（18以上が必要）
node -v

# 依存関係をインストール
npm install

# Playwrightブラウザをインストール
npm run install-browser
```

#### 3. 認証情報の取得

```bash
# ログインスクリプトを実行
npm run login
```

**実行の流れ：**
1. ブラウザウィンドウが自動的に開きます
2. note.comのログインページが表示されます
3. メールアドレス/パスワードまたは外部サービスでログイン
4. ログイン完了後、ホーム画面が表示されることを確認
5. ターミナルに戻って **Enterキー** を押す
6. プロジェクトルートに `.note-state.json` が生成される

**認証情報の確認：**

```bash
# ファイルが正しく生成されたか確認
cat .note-state.json

# 以下のようなJSON形式のデータが表示されればOK
# {
#   "cookies": [...],
#   "origins": [...]
# }
```

⚠️ **重要**: 
- このファイルにはログイン情報が含まれています
- `.gitignore` で除外されているので、Gitにコミットされません
- 外部に漏らさないでください

#### 4. GitHubシークレットの設定

認証情報をGitHubに登録します：

```bash
# macOS/Linux
cat .note-state.json | pbcopy  # クリップボードにコピー

# Windows (PowerShell)
Get-Content .note-state.json | Set-Clipboard

# 手動でコピー
cat .note-state.json
```

**GitHubでの設定手順：**
1. GitHubでリポジトリを開く
2. **Settings** タブをクリック
3. 左サイドバーの **Secrets and variables** → **Actions**
4. **New repository secret** ボタンをクリック
5. 以下を入力：
   - **Name**: `NOTE_STATE_JSON`
   - **Secret**: 上記でコピーした `.note-state.json` の内容を貼り付け
6. **Add secret** をクリック

---

## 📝 記事の作成と投稿

### 新しい記事を作成

```bash
# 記事フォルダを作成（フォルダ名は任意）
mkdir -p note/my-first-article

# Markdownファイルを作成
cat > note/my-first-article/article.md << 'EOF'
---
title: はじめてのnote投稿
tags:
  - はじめまして
  - note
  - GitHub Actions
---

こんにちは！

これは私のはじめてのnote記事です。

## 自己紹介

よろしくお願いします。

## 画像の挿入

![サンプル画像](./sample.png)

## リンク

詳しくはこちら：
https://note.com
EOF

# 画像ファイルもコピー（必要に応じて）
cp /path/to/your/image.png note/my-first-article/sample.png

# Gitにコミット
git add note/my-first-article/
git commit -m "Add my first article"
git push origin main
```

### GitHub Actionsで投稿

#### 下書き保存（推奨：初回）

1. GitHubリポジトリの **Actions** タブを開く
2. **Note Post via MCP** ワークフローを選択
3. **Run workflow** ボタンをクリック
4. パラメータを入力：
   - **target_folder**: `my-first-article`（`note/`配下のフォルダ名）
   - **post_type**: `draft`（下書き保存）
   - **thumbnail_name**: `sample.png`（サムネイル、任意）
5. **Run workflow** をクリック
6. ワークフローの実行ログで進行状況を確認
7. note.comの下書き一覧で記事を確認

#### 公開投稿

下書きを確認して問題なければ、公開投稿します：

1. 同じワークフローを実行
2. パラメータを変更：
   - **target_folder**: `my-first-article`
   - **post_type**: `publish`（公開投稿）
   - **thumbnail_name**: `sample.png`
3. 実行後、note.comで公開された記事を確認

### Markdownファイルの書き方

#### 基本構造

```markdown
---
title: 記事のタイトル
tags:
  - タグ1
  - タグ2
  - タグ3
---

記事の本文をここに書きます。

## 見出し2

### 見出し3

本文が続きます...
```

#### Front Matter（メタデータ）

```yaml
---
title: 記事のタイトル（必須）
tags:
  - タグ1
  - タグ2
  - タグ3
---
```

または配列記法も可能：

```yaml
---
title: 記事のタイトル
tags: [タグ1, タグ2, タグ3]
---
```

---

## 📖 サポートされるMarkdown記法

### 見出し

```markdown
## 大見出し（見出し2）
### 小見出し（見出し3）
```

note.comでは `##` と `###` がサポートされています。

### テキスト装飾

```markdown
**太字のテキスト**
~~取り消し線~~
```

### リスト

```markdown
# 箇条書き
- 項目1
- 項目2
- 項目3

# 番号付きリスト
1. 最初の項目
2. 2番目の項目
3. 3番目の項目
```

### 引用

```markdown
> これは引用ブロックです。
> 複数行にわたって
> 引用することができます。
```

### コードブロック

````markdown
```javascript
// JavaScriptのサンプルコード
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet('note');
```

```python
# Pythonのサンプルコード
def greet(name):
    print(f"Hello, {name}!")

greet("note")
```
````

### 画像の挿入

```markdown
![代替テキスト](./image.png)
![サムネイル](./thumbnail.jpg)
```

**画像の準備：**
- 相対パスで指定（`./`で始める）
- 記事フォルダ内に配置
- フォーマット: PNG, JPEG, GIF
- 推奨サイズ: 幅1200px以下、10MB以下

**サムネイル画像：**
- アスペクト比: 16:9
- 解像度: 1280x720px または 1920x1080px

### URLリンクカード

URLを単独行に書くと、note.comが自動的にリンクカードとして展開します：

```markdown
https://note.com

https://www.youtube.com/watch?v=xxxxx
```

YouTube動画も自動で埋め込まれます。

### 水平線

```markdown
---
```

3つのハイフンで水平線を挿入できます。

---

## 🔧 トラブルシューティング

### 認証エラーが発生する

**症状**: ワークフローが認証エラーで失敗する

**解決方法**:
```bash
# 1. ローカルで認証情報を再取得
npm run login

# 2. 新しい認証情報をコピー
cat .note-state.json | pbcopy

# 3. GitHubシークレットを更新
# Settings → Secrets → Actions → NOTE_STATE_JSON を編集
```

### フォルダが見つからない

**症状**: `Error: Folder note/xxx does not exist`

**解決方法**:
- `note/` 配下に正しいフォルダ名で作成されているか確認
- `target_folder` パラメータが正しいか確認
- フォルダ名は任意（例: `exsample`, `my-article`）

```bash
# フォルダ一覧を確認
ls note/

# 新しいフォルダを作成
mkdir -p note/new-article
```

### Markdownファイルが見つからない

**症状**: `Error: No markdown file found in note/xxx`

**解決方法**:
- フォルダ内に `.md` 拡張子のファイルがあるか確認
- ファイル名は任意ですが、フォルダ内に1つだけ配置

```bash
# ファイル確認
ls note/exsample/

# 必要なら作成
touch note/exsample/article.md
```

### 画像がアップロードされない

**症状**: 本文中の画像が表示されない

**解決方法**:
- 画像パスが相対パス `./` で始まっているか確認
- 画像ファイルがフォルダ内に実際に存在するか確認
- サポートされる画像形式: PNG, JPEG, GIF

```bash
# 画像ファイルの確認
ls note/exsample/*.png

# 画像のリサイズ（大きすぎる場合）
# ImageMagick使用
convert input.png -resize 1200x output.png

# macOSのsipsコマンド
sips -Z 1200 input.png --out output.png
```

### タイムアウトエラー

**症状**: ワークフローが15分でタイムアウト

**原因と対策**:
- note.comのサーバーが重い → 少し時間を置いて再実行
- 画像ファイルが大きすぎる → リサイズして10MB以下に
- 画像が多すぎる → 分割して投稿

### Node.jsのバージョンエラー

**症状**: `node: command not found` または バージョンが古い

**解決方法**:
```bash
# Node.jsのバージョン確認（18以上が必要）
node -v

# nvmを使ってNode.jsをインストール（推奨）
nvm install 20
nvm use 20

# または公式サイトからインストール
# https://nodejs.org/
```

### 依存関係のエラー

**症状**: `npm install` や `npm run` がエラー

**解決方法**:
```bash
# node_modulesを削除して再インストール
rm -rf node_modules package-lock.json
npm install

# ブラウザの再インストール
npm run install-browser
```

---

## 💡 よくある質問

### Q1: 認証情報の有効期限は？

**A**: note.comのセッションが切れるまで有効です（通常は数週間〜数ヶ月）。

認証エラーが発生したら：
```bash
npm run login
# → GitHubシークレットも更新すること
```

### Q2: 複数のnoteアカウントで使える？

**A**: はい、ただしGitHubシークレットは1つのみ設定できます。

**方法1**: リポジトリごとに異なるアカウント
- 別々のGitHubリポジトリを作成
- それぞれ異なる `NOTE_STATE_JSON` を設定

**方法2**: ローカルで複数アカウント管理
- プロジェクトごとに `.note-state.json` を作成
- 投稿時にGitHubシークレットを切り替え

### Q3: プライベートリポジトリでも使える？

**A**: はい、プライベートリポジトリでも使用可能です。

**注意点**:
- GitHub Actionsの無料枠を確認
- プライベートリポジトリは実行時間に制限あり
- 公開前の記事が外部に見られる心配がない（推奨）

### Q4: ローカルで直接投稿できる？

**A**: はい、[note-post-mcp](https://github.com/Go-555/note-post-mcp)をローカル環境でも使えます。

CursorやClaude DesktopなどのMCPクライアントから使用してください。詳細は元のリポジトリを参照してください。

### Q5: 予約投稿はできる？

**A**: 以下の方法があります：

**方法1**: GitHub Actionsのスケジュール実行

```yaml
# .github/workflows/note-post.yaml に追加
on:
  schedule:
    - cron: '0 9 * * *'  # 毎日9:00 UTC（日本時間18:00）
  workflow_dispatch:  # 手動実行も維持
```

**方法2**: 下書き保存後、note.comで公開時刻を設定
1. `draft` で下書き保存
2. note.comの管理画面で公開予約を設定

### Q6: バッチで複数記事を投稿できる？

**A**: はい、シェルスクリプトで自動化できます：

```bash
#!/bin/bash
# batch-post.sh

FOLDERS=("article-1" "article-2" "article-3")

for folder in "${FOLDERS[@]}"; do
  gh workflow run note-post.yaml \
    -f target_folder="$folder" \
    -f post_type="draft"
  sleep 60  # 60秒待機（note.comへの負荷軽減）
done
```

実行：
```bash
chmod +x batch-post.sh
./batch-post.sh
```

### Q7: 記事を更新できる？

**A**: 現在は新規投稿のみです。

**代替方法**:
1. note.comで手動編集
2. 同じ内容で新しい記事を作成して、古い記事を削除

更新機能は今後の拡張予定です。

### Q8: 認証情報を確認したい

**A**: 以下のコマンドで確認できます：

```bash
# 認証情報ファイルの存在確認
ls -la .note-state.json

# 内容を表示（センシティブ情報を含むので注意）
cat .note-state.json

# ファイルサイズ確認
wc -c .note-state.json
```

### Q9: ワークフローの実行履歴を見たい

**A**: GitHubのActionsタブで確認できます：

1. GitHubリポジトリの **Actions** タブ
2. **Note Post via MCP** ワークフローを選択
3. 過去の実行履歴が表示されます
4. 各実行をクリックして詳細ログを確認

### Q10: コストはかかる？

**A**: 基本的に無料です：

- **GitHub Actions**: 
  - パブリックリポジトリ: 無料（無制限）
  - プライベートリポジトリ: 月2,000分まで無料
- **note.com**: 無料プランでも使用可能
- **このツール**: 完全無料（MIT License）

---

## 🔐 セキュリティのベストプラクティス

### 1. 認証情報の管理

- ✅ `.note-state.json` はプロジェクトルートに保存
- ✅ `.gitignore` で除外されているのでGitにコミットされない
- ✅ 定期的に `npm run login` で更新
- ✅ GitHubシークレットも更新を忘れずに
- ❌ `.note-state.json` を他人と共有しない
- ❌ 公開リポジトリにコミットしない

### 2. GitHubシークレットの保護

- ✅ 必要な人にのみリポジトリアクセスを許可
- ✅ シークレットの値は一度設定すると見れなくなる（安全）
- ✅ 定期的に認証情報を更新
- ❌ スクリーンショットやログに認証情報を含めない

### 3. プライベートリポジトリの推奨

- ✅ 記事の下書きが公開される前に外部に見られない
- ✅ 実験的な記事を安全に管理できる
- ✅ チーム内での共同作業がしやすい

---

## 🎯 よく使うコマンド集

```bash
# 認証情報の取得・更新
npm run login

# 依存関係のインストール
npm install

# ブラウザのインストール
npm run install-browser

# 認証情報の確認
cat .note-state.json
ls -la .note-state.json

# 記事フォルダ一覧
ls note/

# 新しい記事フォルダ作成
mkdir -p note/new-article

# Gitにコミット
git add note/
git commit -m "Add new article"
git push

# Node.jsバージョン確認
node -v

# 依存関係の再インストール
rm -rf node_modules package-lock.json && npm install
```

---

## 📚 参考リンク

- [note-post-mcp](https://github.com/Go-555/note-post-mcp) - 元のMCPサーバー
- [note.com](https://note.com) - note公式サイト
- [GitHub Actions Documentation](https://docs.github.com/ja/actions) - GitHub Actions公式ドキュメント
- [Playwright](https://playwright.dev/) - ブラウザ自動化ツール

---

## 📄 ライセンス

MIT License

このプロジェクトは [note-post-mcp](https://github.com/Go-555/note-post-mcp) を使用しています。

---

## 🙏 謝辞

Made with ❤️ using [note-post-mcp](https://github.com/Go-555/note-post-mcp)

---

Happy note.com posting! 📝✨
