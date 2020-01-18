# Mildom Gift Viewer

　ゲーム配信サイトである [Mildom](https://www.mildom.com/) の配信者向けのツールです。このツールを配信画面に加えると、視聴者さんがギフトを投げてくれた場合に、画面上にそのギフトの画像を降らせることができます。


![参考画像](./img/sample.png)


# 使い方

　はじめに、./js/main.js の中身を編集する必要があります。このファイルをテキストエディタで開いた上で「対象者の Mildom ID」と書かれている行の下の数値を、配信者自身の Mildom ID に変更してください。Mildom ID はユーザーの配信ページの URL の一番最後の数字と一致します。


　配信画面に追加するには、OBS の場合は本ツールの simple.html を画面にドラッグ & ドロップで追加できます。画面サイズは配信画面全体にすることをおすすめします。


# 謝辞

　本ツールは [developer-kui/HTMLViewer](https://github.com/developer-kui/HTMLViewer) さんを参考に実装しました。 Mildom の配信ツールを初期の段階から充実していただいた kui さんに感謝します。

# 作者

[うるし|@U_Akihir0](https://twitter.com/U_Akihir0) 

# ライセンス

MIT