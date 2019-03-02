import { Main } from '../scenes/Main';

export class Honeycomb extends Phaser.GameObjects.Arc {
  public matterGameObject: any;
  public scene: Phaser.Scene;

  static RADIUS = 10;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, Honeycomb.RADIUS, 0, 360, false, Main.RED_COLOR);
    this.scene = scene;

    scene.add.existing(this);

    this.matterGameObject = this.scene.matter.add.gameObject(this, {
      shape: { type: 'circle', radius: Honeycomb.RADIUS },
      isStatic: true,
    });
  }
}
