import * as PIXI from 'pixi.js'

const app = new PIXI.Application({ width: 512, height: 768 });
document.body.appendChild(app.view);

/**
 * 実験のため、ロードするファイルをブラウザがキャッシュしないよう
 * わざとファイル名の後ろに?と現在時刻Date()（毎回変わる）を加えています。
 * ロードされるファイルは?より前のファイル名で、?以降は無視されますが、
 * ?以降の値（クエリパラメータと呼ばれます）が変わると
 * URLとしては異なるものとしてブラウザに認識されます。
 * ブラウザは同じURLの再ロードにはキャッシュを利用しますが、
 * 異なる場合は新規にロードします。
 * (以上は、キャッシュバスターと呼ばれる手法) 
 * 
 * なお、一般にはデータ更新時を除いてキャッシュするほうがよいです。
 */
const loadImage = (x, y, fileName, useCache) => {
    let spr;
    if (useCache) {
        spr = PIXI.Sprite.from(fileName);
    }
    else {
        spr = PIXI.Sprite.from(fileName + '?' + Date.now());
    }
    spr.scale.set(0.0625, 0.0625);
    spr.position.set(x, y);
    app.stage.addChild(spr);
};

const init = (useCache) => {
    loadImage(256, 512, 'assets/01_oaktarn.png', useCache);
    loadImage(256, 256, 'assets/02_silverbark.png', useCache);
    loadImage(256, 0, 'assets/03_winsilner.png', useCache);
    loadImage(0, 512, 'assets/04_hotstump.png', useCache);
    loadImage(0, 256, 'assets/05_kilspirise.png', useCache);
    loadImage(0, 0, 'assets/06_ponhayes.png', useCache);
};

init(true);
// init(false);