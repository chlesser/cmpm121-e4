import { Scene } from "phaser";
import { makeTextures } from "../textures.ts";
import { loadSounds } from "../sounds.ts";
import { LaunchOptions, launchScene } from "../main.ts";

export class Boot extends Scene {
  constructor(
    private readonly options: LaunchOptions,
  ) {
    super("Boot");
  }
  init() {
    if (!this.textures.exists("player")) {
      makeTextures(this);
      loadSounds(this);
    }
  }
  create() {
    if (this.options.attract) {
      launchScene(this, "Play", { demo: true });
    } else {
      launchScene(this, "Title");
    }
  }
}
