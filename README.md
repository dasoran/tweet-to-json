# tweet-to-json

## download_home.js
自分のホームタイムラインから最新200件くらいダウンロードして、
* user.json : その中に含まれるユーザー情報をまとめたjson
* tweet.json : ツイートをまとめたjson
* imgwget.sh : user.jsonに含まれるユーザーのアイコンをwgetでダウンロードするスクリプト
を生成する。

出力がelasticsearch用でかつ自分が欲しいデータしか取っていないので、適当に欲しい情報を拾うように弄ってください。
参考(このページの下の方に得られるjsonのサンプルがあるのでそこから必要なデータを引き抜く感じで。)
https://dev.twitter.com/rest/reference/get/statuses/home_timeline
