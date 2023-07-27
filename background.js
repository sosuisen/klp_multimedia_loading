import * as PIXI from 'pixi.js'
import { gsap } from "gsap";
import { PixiPlugin } from "gsap/PixiPlugin";
gsap.registerPlugin(PixiPlugin);
PixiPlugin.registerPIXI(PIXI);

const app = new PIXI.Application({ width: 512, height: 768, backgroundColor: 0xffffff });
app.ticker.stop();
gsap.ticker.add(time => {
  app.ticker.upDate.now();
});
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
  app.stage.addChildAt(spr, 0);
};

// 実験のためキャッシュバスターを使用
const manifest = {
  "bundles": [
    // 基本課題：initバンドルを追加してください。
    {
      "name": "firstLevelStages",
      "assets": [
        {
          "name": "stage01",
          "srcs": "assets/01_oaktarn.png?" + Date.now()
        },
        {
          "name": "stage02",
          "srcs": "assets/02_silverbark.png?" + Date.now()
        },
        {
          "name": "stage03",
          "srcs": "assets/03_winsilner.png?" + Date.now()
        }
      ]
    },
    {
      "name": "secondLevelStages",
      "assets": [
        {
          "name": "stage04",
          "srcs": "assets/04_hotstump.png?" + Date.now()
        },
        {
          "name": "stage05",
          "srcs": "assets/05_kilspirise.png?" + Date.now()
        },
        {
          "name": "stage06",
          "srcs": "assets/06_ponhayes.png?" + Date.now()
        }
      ]
    }
  ]
};

// マニフェストのロード
await PIXI.Assets.init({ manifest });
// backgroundLoadBundleでロードするバンドルが2つ以上の場合は配列
// バンドルが1つの場合は PIXI.Assets.backgroundLoadBundle('firstLevelStages');
PIXI.Assets.backgroundLoadBundle(['init', 'firstLevelStages', 'secondLevelStages']);

/*
const init = await PIXI.Assets.loadBundle('init');
const loading = PIXI.Sprite.from(init.loading);
loading.anchor.set(0.5, 0.5);
loading.position.set(256, 384);
loading.alpha = 0.5;
loading.visible = false;
app.stage.addChild(loading); 

const tl = gsap.timeline();

// 基本課題：duration, repeat, ease,  pixi プロパティを追加してください。
tl.to(loading, { pause: true, });
*/
const startLoading = async () => {   
  /*
    tl.play();
    loading.visible = true;
  */
};

const stopLoading = async () => {
  /*
    tl.pause();
    loading.visible = false;
  */
};


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

startLoading();
const startTime = performance.now(); // 開始時間(ms)
await loadFirstLevel();
const endTime = performance.now(); // 終了時間
document.getElementById('bench1').innerText = endTime - startTime;
stopLoading();

document.getElementById('nextLevel').addEventListener('click', async () => {
  const startTime = performance.now(); // 開始時間(ms)
  startLoading();
  await loadSecondLevel();
  stopLoading();
  const endTime = performance.now(); // 終了時間
  document.getElementById('bench2').innerText = endTime - startTime;
});
