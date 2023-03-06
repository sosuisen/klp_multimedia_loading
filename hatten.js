import * as PIXI from 'pixi.js';

// プログラム内でも使用したいので、ここで import する。
import manifest from "./manifest-hatten.json" assert { type: "json" };

const app = new PIXI.Application({ width: 512, height: 512, backgroundColor: 0xffffff });
document.body.appendChild(app.view);

let currentStageSprite;
const loadStage = (x, y, texture) => {
  currentStageSprite = PIXI.Sprite.from(texture);
  currentStageSprite.scale.set(app.view.width / currentStageSprite.width, app.view.height / currentStageSprite.height);
  currentStageSprite.position.set(x, y);
  // ステージは背景なので、一番奥側（0番目）に追加する。
  app.stage.addChildAt(currentStageSprite, 0);
};

// マニフェストのロード
await PIXI.Assets.init({ manifest });
// バックグラウンドローディング開始
PIXI.Assets.backgroundLoadBundle(['character', 'level01', 'level02']);

// キャラクターのロード
const sheetObj = await PIXI.Assets.loadBundle('character');

const piyo = new PIXI.Container();

const animations = {};
const createAnime = (animeName) => {
  animations[animeName] = new PIXI.AnimatedSprite(sheetObj.spritesheet.animations[animeName]);
  animations[animeName].animationSpeed = 0.1;
  piyo.addChild(animations[animeName]);
};
createAnime('walkLeft');
createAnime('walkRight');
createAnime('walkUp');
createAnime('walkDown');
createAnime('fly');
animations['fly'].loop = false;

const playAnime = (targetAnimeName, startFrame) => {
  Object.keys(animations).forEach(anim => {
    animations[anim].stop();
    animations[anim].visible = false;
  });
  if (startFrame !== undefined) {
    animations[targetAnimeName].gotoAndPlay(startFrame);
  }
  else {
    animations[targetAnimeName].play();
  }
  animations[targetAnimeName].visible = true;
};


// 初期状態では walkDown を再生
playAnime('walkDown');

// 現在の移動方向
let currentMove = '';

// イベントリスナー登録
window.addEventListener("keydown", event => {
  switch (event.key) {
    case 'ArrowRight':
      playAnime('walkRight');
      currentMove = 'walkRight';
      break;
    case 'ArrowLeft':
      playAnime('walkLeft');
      currentMove = 'walkLeft';
      break;
    case 'ArrowDown':
      playAnime('walkDown');
      currentMove = 'walkDown';
      break;
    case 'ArrowUp':
      playAnime('walkUp');
      currentMove = 'walkUp';
      break;
    case ' ':
      playAnime('fly', 0);
      currentMove = 'fly';
      break;
  }
});
window.addEventListener("keyup", () => {
  currentMove = '';
});

app.ticker.add(() => {
  switch (currentMove) {
    case 'walkLeft': piyo.x -= 7; break;
    case 'walkRight': piyo.x += 7; break;
    case 'walkUp': piyo.y -= 7; break;
    case 'walkDown': piyo.y += 7; break;
    default: break;
  }
  if (piyo.x > app.view.width) {
    currentStage++;
    if (currentStage >= manifest.bundles[currentLevel + stageOffset].assets.length) {
      currentStage = 0;
      currentLevel++;
    }
    if (currentLevel >= manifest.bundles.length - stageOffset) {
      alert("Game over!");
      currentMove = '';
      // 最後のステージへ戻す
      currentLevel--;
      currentStage = manifest.bundles[currentLevel + stageOffset].assets.length-1;
      piyo.x = app.view.width - piyo.width;
      return;
    }    
    piyo.x = -piyo.width;
    gotoNextStage();
  }
  else if (piyo.x < - piyo.width) {
    currentStage--;
    // ステージが0未満になったら前のレベルへ戻る
    if (currentStage < 0){      
      if (currentLevel > 0) {
        currentLevel--;
        currentStage = manifest.bundles[currentLevel + stageOffset].assets.length - 1;
        piyo.x = app.view.width - piyo.width;
      }
      else {
        // 最初のレベルの最初のステージの場合
        currentStage = 0;
        piyo.x = -piyo.width; // 左端で止める。
        return;
      }
    }
    else {
      piyo.x = app.view.width - piyo.width;
    }
    gotoNextStage();
  }

});

// ステージのロード
let currentLevel = 0;
let currentStage = 0;
const stageOffset = 1;
let currentBundleName;
let currentAssetName;

const gotoNextStage = async () => {
  currentBundleName = manifest.bundles[currentLevel + stageOffset].name;
  currentAssetName = manifest.bundles[currentLevel + stageOffset].assets[currentStage].name;

  // loadBundleは何度呼んでも問題ない。2度目以降はキャッシュされているため。
  const bundle = await PIXI.Assets.loadBundle(currentBundleName);
  if (currentStageSprite) {
    currentStageSprite.removeFromParent();
  }
  loadStage(0, 0, currentAssetName);
};

await gotoNextStage();
piyo.position.set(0, app.view.height / 2);
app.stage.addChild(piyo);
