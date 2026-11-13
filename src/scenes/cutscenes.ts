import Phaser from "phaser";
import { Backdrop } from "./backdrop.ts";
import { Hud } from "../hud.ts";
import { launchScene } from "../main.ts";
import { HEIGHT, WIDTH } from "../actors.ts";
import { TINTS } from "../textures.ts";
import { play } from "../sounds.ts";

const STORY: [number, string][] = [
  [0.8, "The Warden's lights go dark, one ring at a time."],
  [4.2, "Behind you, five sectors of open sky."],
  [7.6, "Ahead, the long way home."],
];
const WARP_AT = 9;
const CREDITS_AT = 11;
const RETURN_AT = 18;

export class Cutscenes extends Phaser.Scene {
  private backdrop!: Backdrop;
  private cutsceneAfterDemo = false;
  constructor(private readonly hud: Hud) {
    super("Cutscenes");
  }
  init(data: {
    demo?: boolean;
    run?: {
      score: number;
      kills: number;
      hits: number;
      continues: number;
    };
  }) {
    this.cutsceneAfterDemo = data.demo === true;
  }
  create(data: {
    demo?: boolean;
    run?: {
      score: number;
      lives: number;
      kills: number;
      hits: number;
      continues: number;
    };
  }) {
    this.input.keyboard?.on("keydown-SPACE", () => this.onSpace());
    this.backdrop = new Backdrop(this);

    const run = data.run;
    this.hud.setMode("cutscene");
    this.hud.setBoss(null);
    this.cameras.main.fadeIn(600, 4, 2, 12);

    const ship = this.add.image(WIDTH / 2, HEIGHT - 120, "player");
    ship.enableFilters();
    ship.filters?.internal.addGlow(TINTS.player, 5, 0, 1);
    this.add.particles(0, 0, "spark", {
      speedY: { min: 120, max: 260 },
      lifespan: 420,
      scale: { start: 1.2, end: 0 },
      tint: TINTS.player,
      blendMode: "ADD",
      frequency: 16,
    }).startFollow(ship, 0, 18);
    this.tweens.add({
      targets: ship,
      y: HEIGHT - 140,
      duration: 1600,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut",
    });

    for (const [at, line] of STORY) {
      this.time.delayedCall(at * 1000, () => this.hud.say(line));
    }
    this.time.delayedCall(WARP_AT * 1000, () => {
      this.hud.say("");
      play(this, "pickup", 0.7);
      this.tweens.add({
        targets: this.backdrop,
        warp: 18,
        duration: 900,
        ease: "Quad.in",
      });
      this.tweens.killTweensOf(ship);
      this.tweens.add({
        targets: ship,
        y: -80,
        scale: 0.4,
        duration: 1100,
        ease: "Back.in",
      });
      this.time.delayedCall(
        1000,
        () => this.cameras.main.flash(500, 220, 250, 255),
      );
    });
    this.time.delayedCall(CREDITS_AT * 1000, () => {
      this.hud.announce("THANK YOU FOR PLAYING", `Final score ${run.score}`);
      if (this.cutsceneAfterDemo) {
        this.hud.say(
          `Self-play: ${run.kills} kills, ${run.hits} hits, ${run.continues} continues`,
        );
      }
    });
    this.time.delayedCall(RETURN_AT * 1000, () => this.endCutscene());
  }
  override update(_time: number, delta: number): void {
    this.backdrop.scroll(delta);
  }
  private onSpace(): void {
    this.endCutscene();
  }
  endCutscene(): void {
    this.hud.say("");
    launchScene(this, "Title");
  }
}
