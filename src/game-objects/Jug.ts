import { Main } from '../scenes/Main';
import { InitialHoneycomb } from './InitialHoneycomb';

export class Jug {
  private scene: Main;

  constructor(scene: Main) {
    this.scene = scene;
    const rot = Phaser.Math.DegToRad(90);
    const ground = this.scene.add.rectangle(200, 400, 100, 10, Main.RED_COLOR);
    this.scene.matter.add.gameObject(ground, { isStatic: true });

    const left = this.scene.add.rectangle(150, 325, 150, 10, Main.RED_COLOR);
    const leftGO = this.scene.matter.add.gameObject(left, { isStatic: true });
    // @ts-ignore
    leftGO.setRotation(rot);

    const right = this.scene.add.rectangle(250, 350, 100, 10, Main.RED_COLOR);
    const rightGO = this.scene.matter.add.gameObject(right, { isStatic: true });
    // @ts-ignore
    rightGO.setRotation(rot);

    this.initHoneycombs();
  }

  private initHoneycombs() {
    this.scene.rightHoneycombExtremity = new InitialHoneycomb(this.scene, 250, 300);
    this.scene.leftHoneycombExtremity = new InitialHoneycomb(this.scene, 150, 250);
  }
}
