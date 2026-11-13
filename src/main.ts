import Phaser from "phaser";
import { HEIGHT, WIDTH } from "./actors.ts";
import { Hud } from "./hud.ts";
import "./style.css";
import { Boot } from "./scenes/boot.ts";
import { Play } from "./scenes/play.ts";
import { Title } from "./scenes/title.ts";
import { Cutscenes } from "./scenes/cutscenes.ts";

/**
 * URL switches for self-play, e.g. ?attract&speed=4&seed=7
 * - attract: skip the title wait and start the self-play demo at once
 * - speed: fixed steps per displayed frame during self-play (1–8)
 * - seed: changes every random decision in the run
 */
export interface LaunchOptions {
  attract: boolean;
  speed: number;
  seed: number;
}
export interface RunOptions {
  score: number;
  lives: number;
  kills: number;
  hits: number;
  continues: number;
  bossDefeated: boolean;
}

const params = new URLSearchParams(location.search);
const options: LaunchOptions = {
  attract: params.has("attract"),
  speed: Phaser.Math.Clamp(Number(params.get("speed") ?? 1) || 1, 1, 8),
  seed: Number(params.get("seed") ?? 121) || 121,
};
const hud = new Hud();
export function launchScene(
  scene: Phaser.Scene,
  sceneName: string,
  data?: object,
): void {
  if (
    scene.cameras.main.fadeEffect.isRunning &&
    scene.cameras.main.fadeEffect.direction
  ) return;
  scene.cameras.main.fadeOut(450, 4, 2, 12);
  scene.cameras.main.once("camerafadeoutcomplete", () => {
    scene.scene.start(sceneName, data);
  });
}
new Phaser.Game({
  type: Phaser.WEBGL,
  parent: "game",
  width: WIDTH,
  height: HEIGHT,
  backgroundColor: "#04020c",
  scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
  scene: [
    new Boot(options),
    new Title(hud),
    new Play(hud, options),
    new Cutscenes(hud),
  ],
});
