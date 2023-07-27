import * as PIXI from 'pixi.js'

const app = new PIXI.Application({ width: 512, height: 768 });
document.body.appendChild(app.view);

/**
 * 以下、動作説明のためファイル名の後ろに '?' + Date.now() を付けているので、
 * 実際のアプリでは必要がなければ外すこと。
 */

const errorCase = () => {
    // Assets.loadは非同期処理のため、
    // アセットがロード完了していない状態で次へ進む
    const texture = PIXI.Assets.load('assets/01_oaktarn.png' + '?' + Date.now());
    // アセット（texture）がロードされていないためエラー。
    const spr = PIXI.Sprite.from(texture);
    spr.scale.set(0.0625, 0.0625);
    app.stage.addChild(spr);
};

// await を含む関数は、async で宣言しなければならない
const syncCase = async () => {
    // awaitを用いると同期処理になる。
    // 続く処理をアセットのロードが完了するまでブロックする
    const texture = await PIXI.Assets.load('assets/01_oaktarn.png' + '?' + Date.now());
    // アセットのロードが完了したら以下を処理
    const spr = PIXI.Sprite.from(texture);
    spr.scale.set(0.0625, 0.0625);
    app.stage.addChild(spr);
};

const asyncCase = () => {
    // 非同期処理の場合はこう書く。
    // 続く処理をブロックしない。
    // ロードが完了したらthen()が実行される。
    PIXI.Assets.load('assets/02_silverbark.png' + '?' + Date.now()).then(texture => {
        // アセットのロードが完了したら以下を処理
        const spr = PIXI.Sprite.from(texture);
        spr.scale.set(0.0625, 0.0625);
        spr.position.set(256, 0);
        app.stage.addChild(spr);   
        console.log('case3: 02');
    });
    // then()よりも、こちらが先に呼ばれる。
    console.log('case3: 01');
};

const bundleCase = async () => {
    // 複数ファイルをバンドルにセット
    PIXI.Assets.addBundle('maps', {
        'stage03': 'assets/03_winsilner.png' + '?' + Date.now(),
        'stage04': 'assets/04_hotstump.png' + '?' + Date.now(),
    });
    // バンドル内のアセットが同時に読み込まれるのを待つ。
    const maps = await PIXI.Assets.loadBundle('maps');

    const stage03 = PIXI.Sprite.from(maps.stage03);
    stage03.scale.set(0.0625, 0.0625);
    stage03.position.set(0, 256);
    app.stage.addChild(stage03);   

    const stage04 = PIXI.Sprite.from(maps.stage04);
    stage04.scale.set(0.0625, 0.0625);
    stage04.position.set(256, 256);
    app.stage.addChild(stage04);   
};

errorCase(); // エラーになる
// syncCase(); // 同期処理
// asyncCase(); // 非同期処理
// bundleCase(); // バンドルでまとめて処理













