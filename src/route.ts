import Phaser from "phaser";
import { ShmupPrefabSprite } from "./prefab.ts";
import { GameScene } from "./game.ts";

export interface typeStats {
  hp: number;
  y: (i: number) => number;
  score: number;
  radius: number;
  dropChance: number;
  canShoot: boolean;
}
export interface sector {
  name: string;
  description: string;
  wavelength: number;
  waves: wave[];
}
export interface wave {
  numEnemies: number;
  spawnPosEquation: (i: number) => number;
  spawnTimeEquation: (i: number) => number;
  type: string;
}
export const sectors: sector[] = [];
const sector1: sector = {
  name: "Sector 1: Outer Drift",
  description: "Scouts ahead",
  wavelength: 6,
  waves: [
    {
      numEnemies: 4,
      spawnPosEquation: (i) => 240 + (i - 1.5) * 64,
      spawnTimeEquation: () => 60,
      type: "drone",
    },
    {
      numEnemies: 5,
      spawnPosEquation: (i) => 168 + (i - 2) * 44,
      spawnTimeEquation: (i) => 360 + Math.abs(i - 2) * 10,
      type: "drone",
    },
    {
      numEnemies: 5,
      spawnPosEquation: (i) => 312 + (i - 2) * 44,
      spawnTimeEquation: (i) => 660 + Math.abs(i - 2) * 10,
      type: "drone",
    },
    {
      numEnemies: 6,
      spawnPosEquation: (i) => 240 + (i - 2.5) * 64,
      spawnTimeEquation: () => 960,
      type: "drone",
    },
    {
      numEnemies: 4,
      spawnPosEquation: () => 120,
      spawnTimeEquation: (i) => 1200 + i * 24,
      type: "drone",
    },
    {
      numEnemies: 4,
      spawnPosEquation: () => 360,
      spawnTimeEquation: (i) => 1260 + i * 24,
      type: "drone",
    },
  ],
};

const sector2: sector = {
  name: "Sector 2: Shatter Belt",
  description: "Divers incoming",
  wavelength: 7,
  waves: [
    { // six drones, vee
      numEnemies: 6,
      spawnPosEquation: (i) => 240 + (i - 2.5) * 44,
      spawnTimeEquation: (i) => 60 + Math.abs(i - 2.5) * 10,
      type: "drone",
    },
    { // four darts, line
      numEnemies: 4,
      spawnPosEquation: (i) => 240 + (i - 1.5) * 64,
      spawnTimeEquation: () => 300,
      type: "dart",
    },
    { // five darts, column
      numEnemies: 5,
      spawnPosEquation: () => 144,
      spawnTimeEquation: (i) => 600 + i * 24,
      type: "dart",
    },
    { // five darts, column
      numEnemies: 5,
      spawnPosEquation: () => 336,
      spawnTimeEquation: (i) => 720 + i * 24,
      type: "dart",
    },
    { // seven drones, line
      numEnemies: 7,
      spawnPosEquation: (i) => 240 + (i - 3) * 64,
      spawnTimeEquation: () => 1020,
      type: "drone",
    },
    { // five darts, vee
      numEnemies: 5,
      spawnPosEquation: (i) => 240 + (i - 2) * 44,
      spawnTimeEquation: (i) => 1140 + Math.abs(i - 2) * 10,
      type: "dart",
    },
    { // six darts, line
      numEnemies: 6,
      spawnPosEquation: (i) => 240 + (i - 2.5) * 64,
      spawnTimeEquation: () => 1440,
      type: "dart",
    },
  ],
};

const sector3: sector = {
  name: "Sector 3: Gun Lanes",
  description: "Turrets online",
  wavelength: 7,
  waves: [
    { // one turret
      numEnemies: 1,
      spawnPosEquation: (i) => 240 + i * 64,
      spawnTimeEquation: () => 60,
      type: "turret",
    },
    { // six drones, vee
      numEnemies: 6,
      spawnPosEquation: (i) => 240 + (i - 2.5) * 44,
      spawnTimeEquation: (i) => 240 + Math.abs(i - 2.5) * 10,
      type: "drone",
    },
    { // two turrets, line
      numEnemies: 2,
      spawnPosEquation: (i) => 240 + (i - 0.5) * 64,
      spawnTimeEquation: () => 540,
      type: "turret",
    },
    { // six darts, column
      numEnemies: 6,
      spawnPosEquation: () => 240,
      spawnTimeEquation: (i) => 840 + i * 24,
      type: "dart",
    },
    { // two turrets, line
      numEnemies: 2,
      spawnPosEquation: (i) => 240 + (i - 0.5) * 64,
      spawnTimeEquation: () => 1080,
      type: "turret",
    },
    { // six drones, line
      numEnemies: 6,
      spawnPosEquation: (i) => 240 + (i - 2.5) * 64,
      spawnTimeEquation: () => 1140,
      type: "drone",
    },
    { // three turrets, line
      numEnemies: 3,
      spawnPosEquation: (i) => 240 + (i - 1) * 64,
      spawnTimeEquation: () => 1500,
      type: "turret",
    },
  ],
};

const sector4: sector = {
  name: "Sector 4: Lancer Gate",
  description: "Crossfire",
  wavelength: 7,
  waves: [
    { // four lancers, pincer
      numEnemies: 4,
      spawnPosEquation: (i) => (i % 2 === 0 ? -30 : 510),
      spawnTimeEquation: (i) => 60 + Math.floor(i / 2) * 30,
      type: "lancer",
    },
    { // six darts, vee
      numEnemies: 6,
      spawnPosEquation: (i) => 240 + (i - 2.5) * 44,
      spawnTimeEquation: (i) => 360 + Math.abs(i - 2.5) * 10,
      type: "dart",
    },
    { // six lancers, pincer
      numEnemies: 6,
      spawnPosEquation: (i) => (i % 2 === 0 ? -30 : 510),
      spawnTimeEquation: (i) => 600 + Math.floor(i / 2) * 30,
      type: "lancer",
    },
    { // two turrets, line
      numEnemies: 2,
      spawnPosEquation: (i) => 240 + (i - 0.5) * 64,
      spawnTimeEquation: () => 780,
      type: "turret",
    },
    { // six lancers, pincer
      numEnemies: 6,
      spawnPosEquation: (i) => (i % 2 === 0 ? -30 : 510),
      spawnTimeEquation: (i) => 1140 + Math.floor(i / 2) * 30,
      type: "lancer",
    },
    { // eight drones, vee
      numEnemies: 8,
      spawnPosEquation: (i) => 240 + (i - 3.5) * 44,
      spawnTimeEquation: (i) => 1260 + Math.abs(i - 3.5) * 10,
      type: "drone",
    },
    { // eight darts, line
      numEnemies: 8,
      spawnPosEquation: (i) => 240 + (i - 3.5) * 64,
      spawnTimeEquation: () => 1560,
      type: "dart",
    },
  ],
};

const sector5: sector = {
  name: "Sector 5: Last Approach",
  description: "Everything they have",
  wavelength: 8,
  waves: [
    { // three turrets, line
      numEnemies: 3,
      spawnPosEquation: (i) => 240 + (i - 1) * 64,
      spawnTimeEquation: () => 60,
      type: "turret",
    },
    { // six lancers, pincer
      numEnemies: 6,
      spawnPosEquation: (i) => (i % 2 === 0 ? -30 : 510),
      spawnTimeEquation: (i) => 180 + Math.floor(i / 2) * 30,
      type: "lancer",
    },
    { // six darts, left column
      numEnemies: 6,
      spawnPosEquation: () => 120,
      spawnTimeEquation: (i) => 540 + i * 24,
      type: "dart",
    },
    { // six darts, right column
      numEnemies: 6,
      spawnPosEquation: () => 360,
      spawnTimeEquation: (i) => 540 + i * 24,
      type: "dart",
    },
    { // nine drones, vee
      numEnemies: 9,
      spawnPosEquation: (i) => 240 + (i - 4) * 44,
      spawnTimeEquation: (i) => 900 + Math.abs(i - 4) * 10,
      type: "drone",
    },
    { // two turrets, line
      numEnemies: 2,
      spawnPosEquation: (i) => 240 + (i - 0.5) * 64,
      spawnTimeEquation: () => 1020,
      type: "turret",
    },
    { // eight lancers, pincer
      numEnemies: 8,
      spawnPosEquation: (i) => (i % 2 === 0 ? -30 : 510),
      spawnTimeEquation: (i) => 1320 + Math.floor(i / 2) * 30,
      type: "lancer",
    },
    { // eight darts, vee
      numEnemies: 8,
      spawnPosEquation: (i) => 240 + (i - 3.5) * 44,
      spawnTimeEquation: (i) => 1560 + Math.abs(i - 3.5) * 10,
      type: "dart",
    },
  ],
};

sectors.push(sector1, sector2, sector3, sector4, sector5);
const SPAWN_Y = () => -30;

export class Route {
  constructor(
    private readonly scene: Phaser.Scene,
  ) {}

  private readonly enemyTypes: Record<string, typeStats> = {
    drone: {
      hp: 2,
      y: SPAWN_Y,
      score: 100,
      radius: 13,
      dropChance: 0.015,
      canShoot: true,
    },
    dart: {
      hp: 1,
      y: SPAWN_Y,
      score: 150,
      radius: 12,
      dropChance: 0.015,
      canShoot: false,
    },
    turret: {
      hp: 12,
      y: SPAWN_Y,
      score: 400,
      radius: 19,
      dropChance: 0.3,
      canShoot: true,
    },
    lancer: {
      hp: 4,
      y: (i) => 70 + Math.floor(i / 2) * 50,
      score: 250,
      radius: 15,
      dropChance: 0.06,
      canShoot: true,
    },
  };
  createEnemy(
    enemyNum: number,
    x: number,
    type: string = "drone",
  ): void {
    const stats = this.enemyTypes[type];
    const enemy = new ShmupPrefabSprite(
      this.scene,
      x,
      stats.y(enemyNum),
      type,
      stats.hp,
      stats.score,
      stats.radius,
      stats.dropChance,
      stats.canShoot,
      false,
      x,
      enemyNum % 2 === 0 ? 1 : -1,
    );
    (this.scene as GameScene).newEnemy(enemy);
  }

  spawnWave(
    numEnemies: number,
    time: number,
    spawnPosEquation: (i: number) => number,
    spawnTimeEquation: (i: number) => number,
    type: string = "drone",
  ) {
    let i = 0;
    while (i < numEnemies) {
      if (time === spawnTimeEquation(i)) {
        this.createEnemy(i, spawnPosEquation(i), type);
      }
      i++;
    }
  }
  sectorControl(index: number, time: number): void {
    if (index >= sectors.length) return;
    const sector = sectors[index];
    for (const wave of sector.waves) {
      this.spawnWave(
        wave.numEnemies,
        time,
        wave.spawnPosEquation,
        wave.spawnTimeEquation,
        wave.type,
      );
    }
  }
}
