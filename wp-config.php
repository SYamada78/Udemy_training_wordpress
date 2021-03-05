<?php
/**
 * WordPress の基本設定
 *
 * このファイルは、インストール時に wp-config.php 作成ウィザードが利用します。
 * ウィザードを介さずにこのファイルを "wp-config.php" という名前でコピーして
 * 直接編集して値を入力してもかまいません。
 *
 * このファイルは、以下の設定を含みます。
 *
 * * MySQL 設定
 * * 秘密鍵
 * * データベーステーブル接頭辞
 * * ABSPATH
 *
 * @link https://ja.wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// 注意:
// Windows の "メモ帳" でこのファイルを編集しないでください !
// 問題なく使えるテキストエディタ
// (http://wpdocs.osdn.jp/%E7%94%A8%E8%AA%9E%E9%9B%86#.E3.83.86.E3.82.AD.E3.82.B9.E3.83.88.E3.82.A8.E3.83.87.E3.82.A3.E3.82.BF 参照)
// を使用し、必ず UTF-8 の BOM なし (UTF-8N) で保存してください。

// ** MySQL 設定 - この情報はホスティング先から入手してください。 ** //
/** WordPress のためのデータベース名 */
define( 'DB_NAME', 'wordpress' );

/** MySQL データベースのユーザー名 */
define( 'DB_USER', 'wordpress' );

/** MySQL データベースのパスワード */
define( 'DB_PASSWORD', 'wordpress' );

/** MySQL のホスト名 */
define( 'DB_HOST', 'localhost' );

/** データベースのテーブルを作成する際のデータベースの文字セット */
define( 'DB_CHARSET', 'utf8mb4' );

/** データベースの照合順序 (ほとんどの場合変更する必要はありません) */
define( 'DB_COLLATE', '' );

/**#@+
 * 認証用ユニークキー
 *
 * それぞれを異なるユニーク (一意) な文字列に変更してください。
 * {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org の秘密鍵サービス} で自動生成することもできます。
 * 後でいつでも変更して、既存のすべての cookie を無効にできます。これにより、すべてのユーザーを強制的に再ログインさせることになります。
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         '_F=|Bg^*t-q.JIU>yZU>j*q*sIQ={QFS)}pDGcB67nA+p`~e2w`I!49^s6px8J_M' );
define( 'SECURE_AUTH_KEY',  '4VVm.@Sm]]Z[s7ufW@JxS#P(e5MV-^-*DJ;J_~@1JW-`&SS<bK,h#]K~8648-25=' );
define( 'LOGGED_IN_KEY',    'W}3,7H/@^Zmx>Z!R1lA;7>:LLT1T s{u9J~{Y/@!RL(Xv~qW!=V@ZfeP?r/!T!</' );
define( 'NONCE_KEY',        'q.B<<Y<y7R{~NU<DSmA3~[<Vzp#eE>,~EzLR/A*/Z]wUOAYfBf<)X?aF;w-?74Zl' );
define( 'AUTH_SALT',        'S_>#^cz&n%hY.9z>?[x ?sgIm)}/k=os#/j@+6mUnUMpv7 L8_(Kk$!#}/6MGc[0' );
define( 'SECURE_AUTH_SALT', '+vINbHMd=PhnMv+.}.,ogo(y&P,81G,s}Az]zJRIkFVb9REK:{b]YZ&I&`LUC%^H' );
define( 'LOGGED_IN_SALT',   '#|&j=%q|^A?7vn0Vhv#?4KgLg6<Xw0s`}S/8-5N}dhUK0>EbK9|8x36Ui7 ^h<8[' );
define( 'NONCE_SALT',       '4QqteRJKy6N73i-k^/s:o) +g%WE` _A&rFMR)vz(,(~Ob6}0tq_epk`}oOk_Zad' );

/**#@-*/

/**
 * WordPress データベーステーブルの接頭辞
 *
 * それぞれにユニーク (一意) な接頭辞を与えることで一つのデータベースに複数の WordPress を
 * インストールすることができます。半角英数字と下線のみを使用してください。
 */
$table_prefix = 'wp_';

/**
 * 開発者へ: WordPress デバッグモード
 *
 * この値を true にすると、開発中に注意 (notice) を表示します。
 * テーマおよびプラグインの開発者には、その開発環境においてこの WP_DEBUG を使用することを強く推奨します。
 *
 * その他のデバッグに利用できる定数についてはドキュメンテーションをご覧ください。
 *
 * @link https://ja.wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* 編集が必要なのはここまでです ! WordPress でのパブリッシングをお楽しみください。 */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
