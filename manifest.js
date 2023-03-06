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

// マニフェストのロード
await PIXI.Assets.init({manifest: "assets/manifest.json"});

const loadFirstLevel = async () => {
    // バンドルのロード
    const firstLevelStages = await PIXI.Assets.loadBundle('firstLevelStages');
    loadStage(0, 0, firstLevelStages.stage01);
    loadStage(0, 256, firstLevelStages.stage02);
    loadStage(0, 512, firstLevelStages.stage03);   
};

const loadSecondLevel = async () => {
    // バンドルのロード
    const secondLevelStages = await PIXI.Assets.loadBundle('secondLevelStages');
    loadStage(256, 0, secondLevelStages.stage04);
    loadStage(256, 256, secondLevelStages.stage05);
    loadStage(256, 512, secondLevelStages.stage06);   
};

await loadFirstLevel();
// 3秒待ってから次のステージが表示されます
await sleep(3);
await loadSecondLevel();













