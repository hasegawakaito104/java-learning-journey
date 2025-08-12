# SimpleBank - 銀行口座管理システム

## 🏦 概要
Spring BootとReactで実装した銀行口座管理システムです。  
実務で開発した入出金システムの経験を活かして作成しました。

## 📸 画面イメージ

### ログイン画面
- 口座番号とパスワードで認証
- セキュアなログイン処理

### ダッシュボード
- 残高照会
- 入金・出金処理
- 取引履歴表示

## ⚡ 機能一覧

- ✅ **ユーザー認証** - 口座番号とパスワードによるログイン
- ✅ **残高照会** - リアルタイムで現在の残高を表示
- ✅ **入金処理** - 指定金額を口座に入金
- ✅ **出金処理** - 残高チェック付きの出金機能
- ✅ **取引履歴** - 全ての入出金履歴を時系列で表示
- ✅ **トランザクション管理** - @Transactionalによる整合性保証

## 🛠️ 技術スタック

### Backend
- **Java 17**
- **Spring Boot 3.2.0**
- **Spring Data JPA** - データベース操作
- **H2 Database** - インメモリDB（開発用）
- **Lombok** - ボイラープレートコード削減
- **Maven** - ビルドツール

### Frontend
- **React 18**
- **TypeScript** - 型安全性の確保
- **Axios** - HTTP通信
- **CSS-in-JS** - スタイリング

## 📁 プロジェクト構成

```
SimpleBank/
├── simple-bank-backend/     # Spring Boot バックエンド
│   ├── src/main/java/com/simplebank/
│   │   ├── controller/      # REST APIコントローラー
│   │   ├── service/         # ビジネスロジック
│   │   ├── repository/      # データアクセス層
│   │   └── entity/          # エンティティクラス
│   └── pom.xml
│
└── simple-bank-frontend/    # React フロントエンド
    ├── src/
    │   ├── components/      # UIコンポーネント
    │   ├── services/        # API通信サービス
    │   └── App.tsx
    └── package.json
```

## 🚀 セットアップ手順

### 前提条件
- JDK 17以上
- Node.js 16以上
- Maven

### Backend起動
```bash
cd simple-bank-backend
mvn spring-boot:run
```
サーバーが http://localhost:8080 で起動します

### Frontend起動
```bash
cd simple-bank-frontend
npm install
npm start
```
アプリケーションが http://localhost:3000 で起動します

## 🔐 テストアカウント

| 口座番号 | パスワード | 名義 |
|---------|----------|------|
| 1234567890 | password123 | 山田太郎 |
| 0987654321 | password456 | 佐藤花子 |

## 📝 API仕様

### エンドポイント一覧

| メソッド | パス | 説明 |
|---------|------|------|
| POST | /api/account/login | ログイン認証 |
| GET | /api/account/{accountNumber} | 口座情報取得 |
| POST | /api/account/deposit | 入金処理 |
| POST | /api/account/withdraw | 出金処理 |
| GET | /api/account/{accountNumber}/transactions | 取引履歴取得 |

## 💡 技術的な工夫点

### 1. トランザクション管理
```java
@Transactional
public Transaction deposit(String accountNumber, BigDecimal amount) {
    // 整合性を保証した入金処理
}
```

### 2. エラーハンドリング
- 残高不足チェック
- 不正な入力値のバリデーション
- 適切なエラーメッセージの返却

### 3. レスポンシブデザイン
- PC/スマートフォン両対応
- 直感的なUI/UX

### 4. セキュリティ考慮
- パスワードの安全な管理
- CORS設定による適切なアクセス制御

## 🎯 このプロジェクトで学んだこと

1. **Spring Bootの基本構造** - MVC パターンの実装
2. **RESTful API設計** - 適切なHTTPメソッドとステータスコード
3. **Reactでの状態管理** - useState, useEffectの活用
4. **TypeScriptの型定義** - 型安全なフロントエンド開発
5. **非同期通信の実装** - Promise/async-awaitパターン

## 📈 今後の改善予定

- [ ] Spring Securityによる認証強化
- [ ] PostgreSQL/MySQLへの移行
- [ ] 振込機能の追加
- [ ] 定期預金機能
- [ ] 管理者画面の実装
- [ ] Dockerコンテナ化
- [ ] CI/CDパイプライン構築

## 🤝 お問い合わせ

ご質問や改善提案がございましたら、お気軽にご連絡ください。

---

⭐ このプロジェクトが参考になりましたら、スターをお願いします！