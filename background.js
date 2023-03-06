import * as PIXI from 'pixi.js'

const app = new PIXI.Application({ width: 512, height: 768 });
document.body.appendChild(app.view);

const sleep = (waitSeconds) => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve();
		}, waitSeconds * 1000)
	})	
};

const loadStage = (x, y, texture) => {
    const spr = PIXI.Sprite.from(texture);
    spr.scale.set(0.0625, 0.0625);
    spr.position.set(x, y);
    app.stage.addChild(spr);
};

// 実験のためキャッシュバスターを使用
const manifest = {
    "bundles":[
       {
          "name":"firstLevelStages",
          "assets":[
            {
                "name":"stage01",
                "srcs":"assets/01_oaktarn.png?" + Date()
            },
            {
                "name":"stage02",
                "srcs":"assets/02_silverbark.png?" + Date()
            },
            {
                "name":"stage03",
                "srcs":"assets/03_winsilner.png?" + Date()
            }
            ]
       },
       {
          "name":"secondLevelStages",
          "assets":[
            {
                "name":"stage04",
                "srcs":"assets/04_hotstump.png?" + Date()
            },
            {
                "name":"stage05",
                "srcs":"assets/05_kilspirise.png?" + Date()
             },
             {
                "name":"stage06",
                "srcs":"assets/06_ponhayes.png?" + Date()
             }             
          ]
       }
    ]
 };

// マニフェストのロード
await PIXI.Assets.init({ manifest });
// backgroundLoadBundleでロードするバンドルが2つ以上の場合は配列
// バンドルが1つの場合は PIXI.Assets.backgroundLoadBundle('firstLevelStages');
PIXI.Assets.backgroundLoadBundle(['firstLevelStages', 'secondLevelStages']);

const loadFirstLevel = async () => {
    const startTime = performance.now(); // 開始時間(ms)
    // バンドルのロード
    const firstLevelStages = await PIXI.Assets.loadBundle('firstLevelStages');    
    loadStage(0, 0, firstLevelStages.stage01);
    loadStage(0, 256, firstLevelStages.stage02);
    loadStage(0, 512, firstLevelStages.stage03);   
    const endTime = performance.now(); // 終了時間
    document.getElementById('bench1').innerText = endTime - startTime;
};

const loadSecondLevel = async () => {
    const startTime = performance.now(); // 開始時間(ms)
    // バンドルのロード
    const secondLevelStages = await PIXI.Assets.loadBundle('secondLevelStages');
    loadStage(256, 0, secondLevelStages.stage04);
    loadStage(256, 256, secondLevelStages.stage05);
    loadStage(256, 512, secondLevelStages.stage06);
    const endTime = performance.now(); // 終了時間
    document.getElementById('bench2').innerText = endTime - startTime;
};

await loadFirstLevel();
document.getElementById('nextLevel').addEventListener('click', () => {
    loadSecondLevel();
});














