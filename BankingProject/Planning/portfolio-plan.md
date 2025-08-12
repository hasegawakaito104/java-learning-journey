# ポートフォリオ作成計画 - シンプル銀行システム

## 作るもの：「SimpleBank - 口座管理システム」

### なぜこれを選ぶか
- スキルシートの「入出金システム」経験を証明できる
- Spring Boot + React の実装力を見せられる
- 1週間で作れる規模
- 面接官に分かりやすい

## システム構成

### バックエンド（Spring Boot）
```
src/
├── controller/
│   └── AccountController.java    # REST API
├── service/
│   └── AccountService.java       # ビジネスロジック
├── repository/
│   └── AccountRepository.java    # データアクセス
├── entity/
│   ├── Account.java              # 口座エンティティ
│   └── Transaction.java          # 取引エンティティ
└── SimpleBankApplication.java    # メインクラス
```

### フロントエンド（React + TypeScript）
```
src/
├── components/
│   ├── LoginForm.tsx             # ログイン画面
│   ├── Dashboard.tsx             # ダッシュボード
│   ├── DepositForm.tsx           # 入金画面
│   ├── WithdrawForm.tsx          # 出金画面
│   └── TransactionHistory.tsx   # 取引履歴
├── services/
│   └── api.ts                    # API通信
└── App.tsx                       # メインコンポーネント
```

## 実装する機能（最小限だけど面接でアピールできる）

### 1. 基本機能
- ✅ ログイン（簡単な認証）
- ✅ 口座残高表示
- ✅ 入金処理
- ✅ 出金処理
- ✅ 取引履歴表示

### 2. 技術的アピールポイント
- **トランザクション管理**：@Transactionalアノテーション使用
- **バリデーション**：残高不足チェック、マイナス入力防止
- **RESTful API**：適切なHTTPメソッド使用
- **エラーハンドリング**：例外処理を実装
- **レスポンシブデザイン**：PC/スマホ対応

## データベース設計（H2 Database使用 - 設定不要）

### accountsテーブル
| カラム | 型 | 説明 |
|--------|-----|------|
| id | BIGINT | 口座ID |
| account_number | VARCHAR | 口座番号 |
| owner_name | VARCHAR | 口座名義 |
| balance | DECIMAL | 残高 |
| created_at | TIMESTAMP | 作成日時 |

### transactionsテーブル
| カラム | 型 | 説明 |
|--------|-----|------|
| id | BIGINT | 取引ID |
| account_id | BIGINT | 口座ID |
| type | VARCHAR | 取引種別（DEPOSIT/WITHDRAW） |
| amount | DECIMAL | 金額 |
| balance_after | DECIMAL | 取引後残高 |
| created_at | TIMESTAMP | 取引日時 |

## 画面イメージ

### 1. ログイン画面
```
┌─────────────────────────┐
│    SimpleBank Login     │
│                         │
│  口座番号: [_______]    │
│  パスワード: [_______]   │
│                         │
│     [ログイン]          │
└─────────────────────────┘
```

### 2. ダッシュボード
```
┌─────────────────────────┐
│  ようこそ 山田太郎 様    │
│                         │
│  現在の残高             │
│  ¥1,234,567            │
│                         │
│  [入金] [出金] [履歴]   │
└─────────────────────────┘
```

### 3. 入金画面
```
┌─────────────────────────┐
│       入金処理          │
│                         │
│  金額: [_______] 円     │
│                         │
│  [入金する] [キャンセル] │
└─────────────────────────┘
```

## 面接でのアピール方法

### 技術的な説明
「このポートフォリオでは、実務で使用したSpring BootとReactの技術を活用しています。バックエンドではRESTful APIを実装し、@Transactionalアノテーションでトランザクション管理を行っています。フロントエンドではTypeScriptで型安全性を確保し、非同期通信でリアルタイムに残高を更新しています」

### 工夫した点
1. **セキュリティ**：「パスワードはBCryptでハッシュ化」
2. **エラー処理**：「残高不足や不正な入力を適切にハンドリング」
3. **UX**：「取引完了後に残高を即座に反映」
4. **テスト**：「JUnitで単体テストを実装」

### 実務との関連性
「実務で開発した入出金システムの経験を活かし、基本的な銀行機能を実装しました。特にトランザクション処理と画面の非同期通信は、実際の案件で学んだパターンを応用しています」

## 開発スケジュール（1週間で完成）

### Day 1：環境構築とDB設計
- Spring Boot プロジェクト作成
- H2 Database設定
- エンティティクラス作成

### Day 2：バックエンド基本実装
- Repository層実装
- Service層実装
- Controller層実装（API作成）

### Day 3：バックエンドテスト
- Postmanでテスト
- エラーハンドリング追加
- トランザクション確認

### Day 4：フロントエンド環境構築
- React + TypeScriptセットアップ
- 基本コンポーネント作成
- ルーティング設定

### Day 5：フロントエンド画面実装
- ログイン画面
- ダッシュボード
- 入出金画面

### Day 6：フロントエンド連携
- API通信実装
- エラー表示
- ローディング処理

### Day 7：最終調整とデプロイ
- デザイン調整
- README作成
- GitHubにプッシュ
- デモ動画作成

## 必要な準備

### 開発環境
- JDK 17
- Node.js
- VS Code or IntelliJ IDEA
- Git

### 学習が必要な部分（これから一緒にやります）
1. Spring Bootの基本構造
2. REST APIの作り方
3. Reactの基本
4. TypeScriptの型定義
5. 非同期通信（fetch/axios）

## GitHub READMEに書く内容

```markdown
# SimpleBank - 口座管理システム

## 概要
Spring BootとReactで実装したシンプルな銀行口座管理システム

## 機能
- 口座残高照会
- 入金・出金処理
- 取引履歴表示
- トランザクション管理

## 技術スタック
- Backend: Java 17, Spring Boot 3.0, H2 Database
- Frontend: React 18, TypeScript, Material-UI
- Testing: JUnit, Mockito

## セットアップ
1. バックエンド起動
   ```
   cd backend
   ./mvnw spring-boot:run
   ```
2. フロントエンド起動
   ```
   cd frontend
   npm install
   npm start
   ```

## API仕様
- POST /api/login - ログイン
- GET /api/account/{id} - 口座情報取得
- POST /api/account/deposit - 入金
- POST /api/account/withdraw - 出金
- GET /api/transactions/{accountId} - 取引履歴
```

---

これで面接官に「実務経験あり」と納得してもらえるポートフォリオになります！