import { error, success, warn } from "../../components/modules/alerts";

export const alerts = {
  default: {
    warn: () => warn("問題が発生したため通信を打ち切りました"),
    error: () => error("通信に失敗しました"),
    sucsss: () => success("通信に成功しました")
  },

  required_login: {
    warn: () => warn("ログインする必要があります"),
    error: () => error("ログインしてください"),
    success: () => success("")
  },

  required_title: {
    warn: () => warn(""),
    error: () => error("タイトルを入力してください"),
    success: () => success("")
  },

  required_image_file: {
    warn: () => warn(""),
    error: () => error("画像ファイルのみ選択できます"),
    success: () => success("")
  },

  login_check: {
    warn: () => warn(""),
    error: () => error("ログインチェックに失敗しました"),
    success: () => success("")
  },

  login: {
    warn: () => warn(""),
    error: () => error("ログインに失敗しました"),
    success: () => success("ログインしました")
  },

  logout: {
    warn: () => warn(""),
    error: () => error("ログアウトに失敗しました"),
    success: () => success("ログアウトしました")
  },

  get_fanfic: {
    warn: () => warn(""),
    error: () => error("作品の取得に失敗しました"),
    success: () => success("作品を取得しました")
  },

  get_fanfic_contents: {
    warn: () => warn(""),
    error: () => error("作品のコンテンツの取得に失敗しました"),
    success: () => success("作品のコンテンツを取得しました")
  },

  get_fanfic_trends: {
    warn: () => warn(""),
    error: () => error("トレンドの取得に失敗しました"),
    success: () => success("")
  },

  get_followee_list: {
    warn: () => warn(""),
    error: () => error("フォロイーの取得に失敗しました"),
    success: () => success("")
  },

  get_follower_list: {
    warn: () => warn(""),
    error: () => error("フォロワーの取得に失敗しました"),
    success: () => success("")
  },

  create_fanfic: {
    warn: () => warn(""),
    error: () => error("作品の作成に失敗しました"),
    success: () => success("作品を作成しました")
  },

  update_fanfic: {
    warn: () => warn(""),
    error: () => error("作品の更新に失敗しました"),
    success: () => success("作品を更新しました")
  },

  update_fanfic_contents: {
    warn: () => warn(""),
    error: () => error("作品のコンテンツの更新に失敗しました"),
    success: () => success("作品のコンテンツを更新しました")
  },

  upload_image: {
    warn: () => warn(""),
    error: () => error("画像のアップロードに失敗しました"),
    success: () => success("画像をアップロードしました")
  },

  delete_fanfic: {
    warn: () => warn(""),
    error: () => error("作品の削除に失敗しました"),
    success: () => success("作品を削除しました")
  },

  delete_fanfic_contents: {
    warn: () => warn(""),
    error: () => error("作品のコンテンツの削除に失敗しました"),
    success: () => success("作品のコンテンツを削除しました")
  },

  get_user: {
    warn: () => warn(""),
    error: () => error("ユーザー情報の取得に失敗しました"),
    success: () => success("ユーザー情報を取得しました")
  },

  exist_fanfic: {
    warn: () => warn("入力されたIDを持つ作品はありません"),
    error: () => error("通信に失敗しました"),
    success: () => success("")
  },

  update_user: {
    warn: () => warn(""),
    error: () => error("プロフィールの更新に失敗しました"),
    success: () => success("プロフィールを更新しました")
  },

  fanfic_parents: {
    warn: () => warn("他の作品のみ親作品として登録できます"),
    error: () => error("親作品は３つまで登録できます"),
    success: () => success("")
  },

  follow_user: {
    warn: () => warn("自分をフォローすることはできません"),
    error: () => error("フォローに失敗しました"),
    success: () => success("フォローしました")
  },

  unfollow_user: {
    warn: () => warn(""),
    error: () => error("フォローを解除できませんでした"),
    success: () => success("フォローを解除しました")
  },

  unsubscribe: {
    warn: () => warn(""),
    error: () => error("退会に失敗しました"),
    success: () => success("退会しました")
  },

  fanfic_like: {
    warn: () => warn("自分の作品をいいね！することはできません"),
    error: () => error("いいね！に失敗しました"),
    success: () => success("いいね！しました")
  },

  get_notifies: {
    warn: () => warn(""),
    error: () => error("通知の取得に失敗しました"),
    success: () => success("")
  }
};
