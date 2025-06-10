# 川崎市ごみ分別アプリ 🗑️

川崎市民のためのごみ分別・収集スケジュール管理アプリです。品目検索、収集日カレンダー、リマインダー通知などの機能を提供します。

## 主な機能

- 📱 **ごみ分別検索** - 5,000以上の品目から適切な分別方法を検索
- 📅 **収集カレンダー** - 地区別の収集スケジュールを確認
- 🔔 **リマインダー通知** - 収集日前日の通知機能
- 🌍 **多言語対応** - 日本語、英語、中国語、韓国語、ポルトガル語、ベトナム語に対応
- 🎨 **ダーク/ライトモード** - システム設定に連動したテーマ切り替え
- 🔍 **AI画像認識** - カメラで撮影した品目を自動判別（開発中）

## 技術スタック

- **React Native** - Expo SDK 53
- **TypeScript** - 型安全な開発環境
- **Expo Router** - ファイルベースのルーティング
- **AsyncStorage** - ローカルデータ保存
- **Expo Notifications** - プッシュ通知

## セットアップ

### 必要な環境

- Node.js 18以上
- npm または yarn
- iOS/Androidエミュレータ（オプション）

### インストール手順

1. 依存関係のインストール

   ```bash
   npm install
   ```

2. 開発サーバーの起動

   ```bash
   npm start
   ```

3. アプリの実行

   - **iOS**: `i`キーを押す
   - **Android**: `a`キーを押す
   - **Web**: `w`キーを押す

## 開発コマンド

```bash
# 開発サーバー起動
npm start

# iOS実行
npm run ios

# Android実行
npm run android

# Web実行
npm run web

# リント実行
npm run lint

# プロジェクトリセット
npm run reset-project
```

## プロジェクト構造

```
├── app/                    # アプリケーションのルート
│   ├── (tabs)/            # タブナビゲーション
│   │   ├── index.tsx      # ホーム画面
│   │   ├── calendar.tsx   # カレンダー画面
│   │   ├── search.tsx     # 検索画面
│   │   └── settings.tsx   # 設定画面
│   ├── _layout.tsx        # ルートレイアウト
│   └── +not-found.tsx     # 404ページ
├── components/            # 再利用可能なコンポーネント
├── contexts/              # Reactコンテキスト
├── data/                  # アプリケーションデータ
│   ├── areas.ts          # 地区情報
│   ├── wasteItems.ts     # ごみ品目データベース
│   └── holidays.ts       # 祝日データ
├── hooks/                 # カスタムフック
├── services/              # 外部サービス連携
└── types/                 # TypeScript型定義
```

## データ管理

- **ごみ品目データ**: 5,000以上の品目を含むローカルデータベース
- **地区情報**: 川崎市の全地区（川崎区、幸区、中原区、高津区、宮前区、多摩区、麻生区）に対応
- **収集スケジュール**: 各地区の収集曜日と時間を管理

## 貢献方法

1. このリポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。

## お問い合わせ

ご質問や提案がありましたら、Issueを作成してください。
