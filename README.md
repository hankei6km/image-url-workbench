# ImageURL Workbench

[ImageURL Wrokbench](https://image-url-workbench.vercel.app/) は [imgix](https://imgix.com/) の [Rendering API](https://docs.imgix.com/apis/rendering) を利用して画像を加工し、レスポンシブ対応タグ等を生成するウェブアプリです。

<a href="https://image-url-workbench.vercel.app/" target="_blank" rel="noopener noreferrer"><img src="https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/c3cc6fd7e4a34b748dc359801b1095ac/image-url-workbench-screenshot.png?auto=compress&#x26;w64=NTAw" alt="ImageURL Workbench へのリンク画像" width="500" height="297"></a>

## 概要

imgix のライブラリへアップロードされているファイルは、ファイル GET 時にクエリーパラメーターを指定することで、画像を加工した状態で取得できます。

これにより、サーバー上に複数の画像ファイルを保存することなく、異なるサイズや解像度の画像を容易に取得できるようになります。

しかしながら、各種パラメーターを調整したり、レスポンシブ対応用に複数サイズ用のパラメーターを管理するのはそれなりに手間がかかります。

ImageURL Workbench ではそれらの手間を軽減するために開発しています。


なお、現時点では microCMS のライブラリーを通して imgix の Rendering API を利用しているので、構成上利用が難しい機能については検証等を行えていません。


## 主な機能

- Rendering API パラメーターを UI から指定し、効果をリアルタイムで確認 
- レスポンシブ対応用の画像ファイルセットを作成
- &lt;img&gt; &lt;picture&gt; タグ、ダウンロード用コマンド等の自動生成
- 生成したタグを CodePen へアップロード & プレビュー
- [Base64 Variants](https://docs.imgix.com/apis/rendering#base64-variants) 対応

## ライブデモ

[ImageURL Wrokbench](https://image-url-workbench.vercel.app/)

<a href="https://image-url-workbench.vercel.app/" target="_blank" rel="noopener noreferrer"><img src="https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/c3cc6fd7e4a34b748dc359801b1095ac/image-url-workbench-screenshot.png?auto=compress&#x26;w64=NTAw" alt="ImageURL Workbench へのリンク画像" width="500" height="297"></a>

## デモスライド

[imgix Rendering API Showcase](https://hankei6km.github.io/mardock/deck/try-imgix-rendering-api): imgix + ImageURL Workbench で作成した画像をスライドにまとめたものです。

<a href="https://hankei6km.github.io/mardock/deck/try-imgix-rendering-api" target="_blank" rel="noopener noreferrer"><img src="https://hankei6km.github.io/mardock/assets/deck/try-imgix-rendering-api/try-imgix-rendering-api.png" alt="imgix Rendering API Showcase へのリンク先画像" width="500" height="281"></a>

## デモ動画

### imgix の Rendering API でレスポンシブ対応

[![ImageURL Workbench: imgix の Rendering API でレスポンシブ対応](https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/89d1dc2babc143429999bbdf3f63dfbf/youtube-thumb.png?auto=compress&mark64=aHR0cDovL2ltZy55b3V0dWJlLmNvbS92aS9OajZSc0VyaXd6US8wLmpwZw&mark-pad64=MA&txt64=4pa277iP&txt-align64=Y2VudGVyLG1pZGRsZQ&txt-shad64=Mw&txt-size64=NjA)](http://www.youtube.com/watch?v=Nj6RsEriwzQ)

### imgix の顔検出でレスポンシブ対応

[![ImageURL Workbench: imgix の顔検出でレスポンシブ対応](https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/412ca999d3794941ad3f23bed60e834e/youtube-thumb-base.jpg?auto=compress&mark64=aHR0cDovL2ltZy55b3V0dWJlLmNvbS92aS9wNkMwcVpIbmR6OC8wLmpwZw&mark-pad64=MA&txt64=4pa277iP&txt-align64=Y2VudGVyLG1pZGRsZQ&txt-shad64=NQ&txt-size64=NjA)](http://www.youtube.com/watch?v=p6C0qZHndz8)

### imgix の Redering API で Twitter カード生成 

[![ImageURL Workbench: imgix の Redering API で Twitter カード生成](https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/89d1dc2babc143429999bbdf3f63dfbf/youtube-thumb.png?auto=compress&mark64=aHR0cDovL2ltZy55b3V0dWJlLmNvbS92aS8xQUVlN19pNGtlQS8wLmpwZw&mark-pad64=MA&txt64=4pa277iP&txt-align64=Y2VudGVyLG1pZGRsZQ&txt-shad64=Mw&txt-size64=NjA)](http://www.youtube.com/watch?v=1AEe7_i4keA)

## ライブデモ版の基本的な使い方

[ImageURL Wrokbench](https://image-url-workbench.vercel.app/) にはライブラリーから画像を選択する機能がないため、クリップボード経由で画像の URL をコピーし貼り付けることで各種処理を行います。

以下の記述では microCMS のライブラリーを例にしていますが、他ライブラリーからでも URL がコピーできれば基本的な操作に違いはありません。


### 画像の加工

単一の画像として利用する場合の操作方法です。

1. microCMS のライブラリーから画像ファイルの URL をコピー
<br><a href="https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/b317ba81a7e0436a8d457019811428d3/docs-copy-image-url.png" target="_blank" rel="noopener noreferrer"><img src="https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/b317ba81a7e0436a8d457019811428d3/docs-copy-image-url.png?w64=NTAw" alt="画像ファイルの URL をコピーしているスクリーンショット" width="500" height="314"></a>
1. [ImageURL Wrokbench](https://image-url-workbench.vercel.app/) を開き URL を貼り付けて「NEW」をクリック
<br><a href="https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/9745b9d048b04fddb9f62a589b6066b6/docs-paste-image-url.png" target="_blank" rel="noopener noreferrer"><img src="https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/9745b9d048b04fddb9f62a589b6066b6/docs-paste-image-url.png?w64=NTAw" alt="URL を張り付けているスクリーンショット" width="500" height="293"></a>
1. 簡易的な加工は画面上部の「Size」ボタンなどで指定
<br><a href="https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/c49133abeb774408aa502cd594e8891f/docs-apply-template.png" target="_blank" rel="noopener noreferrer"><img src="https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/c49133abeb774408aa502cd594e8891f/docs-apply-template.png?auto=format%2Ccompress&#x26;h64=MzAw&#x26;w64=NTAw" alt="ボタンの位置を示すスクリーンショット" width="500" height="249"></a>
1. 詳細な調整は画像をクリックし「Render」画面で指定
<br><a href="https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/d762071c6dd5494391c96aca397cf271/docs-render.png" target="_blank" rel="noopener noreferrer"><img src="https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/d762071c6dd5494391c96aca397cf271/docs-render.png?auto=compress&#x26;w64=NTAw" alt="Render 画面のスクリーンショット" width="500" height="297"></a>
1. 加工が完了したら「Workbench」画面で「Try it」ボタンをクリックし、用途に合わせてドロワーを開く
<br><a href="https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/f1d8e1e7e56241588fd8d6773c6c531a/docs-try-it.png" target="_blank" rel="noopener noreferrer"><img src="https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/f1d8e1e7e56241588fd8d6773c6c531a/docs-try-it.png?w64=NTAw" alt="Trt it 画面のスクリーンショット" width="500" height="257"></a>

### レスポンシブ用の画像ファイルセット作成

レスポンシブ用タグを作成する基本的な操作です。上記の加工後にレスポンシブ用テンプレートの適用もできます(例: 画像をセピア調にしたあと、レスポンシブ対応にするなど)。

1. microCMS のライブラリーから画像ファイルの URL をコピー
<br><a href="https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/b317ba81a7e0436a8d457019811428d3/docs-copy-image-url.png" target="_blank" rel="noopener noreferrer"><img src="https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/b317ba81a7e0436a8d457019811428d3/docs-copy-image-url.png?w64=NTAw" alt="画像ファイルの URL をコピーしているスクリーンショット" width="500" height="314"></a>
1. [ImageURL Wrokbench](https://image-url-workbench.vercel.app/) を開き URL を貼り付けて「NEW」をクリック
<br><a href="https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/9745b9d048b04fddb9f62a589b6066b6/docs-paste-image-url.png" target="_blank" rel="noopener noreferrer"><img src="https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/9745b9d048b04fddb9f62a589b6066b6/docs-paste-image-url.png?w64=NTAw" alt="URL を張り付けているスクリーンショット" width="500" height="293"></a>
1. 画面上部のボタンから「Responsive」ボタンをクリックし表示されたテンプレートを選択
<br><a href="https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/e23bda3b44d1485e915cdfc0adbf93e4/docs-responsive.png" target="_blank" rel="noopener noreferrer"><img src="https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/e23bda3b44d1485e915cdfc0adbf93e4/docs-responsive.png?auto=compress&#x26;w64=NTAw" alt="レスポンシブ用テンプレート一覧のスクリーンショット" width="500" height="372"></a>
1. 画像ファイルセットが生成されるので、必要に応じて画像を選択する
<br><a href="https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/10ba31f5fdc74bcba454824d8fccf055/docs-image-set.png" target="_blank" rel="noopener noreferrer"><img src="https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/10ba31f5fdc74bcba454824d8fccf055/docs-image-set.png?auto=compress&#x26;w64=NTAw" alt="画像ファイルセットのスクリーンショット" width="500" height="297"></a>
1. 「Try it」画面から「Preview &lt;Picture&gt; Tag」等を開き「Try it on CodePen」横のボタンをクリック
<br><a href="https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/588ad0fa17df4075a43a19edf7d38464/docs-try-it-on-codepen.png" target="_blank" rel="noopener noreferrer"><img src="https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/588ad0fa17df4075a43a19edf7d38464/docs-try-it-on-codepen.png?auto=compress&#x26;w64=NTAw" alt="Try it on CodePen ボタンのスクリーンショット" width="500" height="298"></a>
1. CodePen 上で動作を確認
<br><a href="https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/d99a0b14179d473480472ddfb71d1e4d/docs-codepen-800.png" target="_blank" rel="noopener noreferrer"><img src="https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/d99a0b14179d473480472ddfb71d1e4d/docs-codepen-800.png?auto=compress&#x26;w64=NTAw" alt="CodePen の幅を 800 にしたときのスクリーンショット" width="500" height="297"></a>
<br><a href="https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/425525dfa718476ea7f3ff6964e2bb3d/docs-codepen-330.png" target="_blank" rel="noopener noreferrer"><img src="https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/425525dfa718476ea7f3ff6964e2bb3d/docs-codepen-330.png?auto=compress&#x26;w64=NTAw" alt="CodePen の幅を 330 にしたときのスクリーンショット" width="500" height="297"></a> 


## テンプレート、スクリプト化

画像ファイルを実際のコンテンツで利用する場合、生成されたタグを直接利用するのではなく [unified](https://github.com/unifiedjs/unified) や [cheerio](https://cheerio.js.org/) などでテンプレート的に利用することが多くなると予想しています。

とくに microCMS では「画像ファイル URL の直接利用は非推奨」となっているため、生成したタグ等はテンプレート的に利用することがベターだと言えます。

### Rendering API の特性を利用

imgix の Rendering API では「画像を GET するときに URL へクエリーパラメーターを付加することで画像の加工が実行」されます。

また、同じような画像(画角等が同じ)であれば、他の画像用に作成したパラメーターでもそのまま切り貼り(URL の末尾へ連結)しても違和感が少なく利用できます。

以下の 2 つの例はこの特性を利用しています。

#### テンプレート化の例

「Try it」画面の「Make testbed 〜」では、生成されたタグの `src` 属性を差し替えるコードを CodePen 上へアップロードします。

アップロードされた画面では、 他画像の URL (imgix へアップロードされているもの)を「Enter another image url」へ入力することで、異なる画像での適用状況を確認できます。


#### スクリプト化の例

「Try it」画面の「Make images by using current parameters」では、画像を加工しながらダウンロードするスクリプトを生成しています。


動作の概要については以下の動画を参照してください。


[![imgix の画像を加工するテンプレートスクリプト生成](https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/89d1dc2babc143429999bbdf3f63dfbf/youtube-thumb.png?auto=compress&mark64=aHR0cDovL2ltZy55b3V0dWJlLmNvbS92aS9rWExvemUtWGtuZy8wLmpwZw&mark-pad64=MA&txt64=4pa277iP&txt-align64=Y2VudGVyLG1pZGRsZQ&txt-shad64=Mw&txt-size64=NjA)](http://www.youtube.com/watch?v=kXLoze-Xkng)


### 中間表現 [実験的実装]

※ 現状では仕様が固まっていません。

画像の画角などにあわせてテンプレート化しやすいように、生成した内容を中間表現として出力できます。


## インポート・エクスポート [実験的実装]
 
「Try it」画面から Workbench の状態をエクスポートできます。また「Home」画面では「IMPORT」タブからインポートできます。インポートでは異なる画像に差し替えることもできます。

ただし、現状では仕様が固まっていないのでインポートできなくなる可能性が高いです。

<a href="https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/c741613e522249b494b833b74cd76406/docs-import.png"><img src="https://images.microcms-assets.io/assets/bc4007b30bdf402f96161596bd7cbcca/c741613e522249b494b833b74cd76406/docs-import.png?auto=compress&#x26;w64=NTAw" alt="インポート時のスクリーンショット" width="500" height="297"></a>


## クレジット (動画内の人物の写真)

- Pexels の Christina Morillo による写真
  - https://www.pexels.com/ja-jp/photo/macbook-1181352/
- Pexels の Oleg Magni による写真
  - https://www.pexels.com/ja-jp/photo/2764683/


## LICENSE

MIT License

Copyright (c) 2020,2021 hankei6km

template 1: TypeScript Next.js example MIT

template 2: Material UI Next.js example MIT

