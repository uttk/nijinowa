
※ 現在、サービス公開に向けてデモページを停止しています。サービス公開後のソースコードは、このリポジトリ同じようにgithubで公開する予定です。

# NIJINOWA

NIJINOWA は、画像を投稿できるWebアプリです。

~[デモページ](https://nijinowa-ce2a2.web.app/)~ ( 現在は停止してます )

# リポジトリの特徴

## TypeScript

`TypeScript`を使って、型安全なコンポーネントや処理を書いています。

## ReactHooks

`ReactHooks`のみを使い**Class コンポーネントを一切使わないようにしています。**

## No Redux

**`Redux`やそのミドルウェアを使ってない**ので、依存が少ないです。

## AtomicDesign によるフォルダー構成

コンポーネントを`AtomicDesign`によって、分割しています。

| 要素      | 特徴                                        |
| --------- | :------------------------------------------ |
| atoms     | `ReatHooks`を使わない SFC                   |
| molecules | `atoms` と同じだが、要素が `atoms` より多い |
| organisms | `ReactHooks` を使っているコンポーネント     |
| pages     | 一つのウェブページを構成するコンポーネント  |
| templates | `pages` の共通部分をまとめるコンポーネント  |

# コンポーネントの基本構成

```
/ComponentName
 |
 +--index.tsx                 <- JSXを書く
 +--ComponentName.moduls.scss <- index.tsxで使うcssを記述する
 +--use.ts                    <- index.tsxで使うカスタムHooksを定義する
```
