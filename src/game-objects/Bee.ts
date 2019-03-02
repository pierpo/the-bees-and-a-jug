import { Main } from '../scenes/Main';

export class Bee extends Phaser.GameObjects.Arc {
  public matterGameObject: Phaser.GameObjects.GameObject;
  public scene: Phaser.Scene;

  static RADIUS = 5;

  getMass(): number {
    // @ts-ignore
    return this.matterGameObject.body.mass;
  }

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, Bee.RADIUS, 0, 360, false, Main.YELLOW_COLOR);
    this.scene = scene;

    this.scene.add.existing(this);

    // @ts-ignore
    this.matterGameObject = this.scene.matter.add.gameObject(this, {
      shape: { type: 'circle', radius: Bee.RADIUS },
    });

    // @ts-ignore
    this.matterGameObject.setAngle(90);

    this.fly();
  }

  private fly() {
    // @ts-ignore
    this.matterGameObject.thrust(-0.01 * this.getMass());

    // @ts-ignore
    this.matterGameObject.applyForce(new Phaser.Math.Vector2(-0.001 * this.getMass(), 0));

    this.scene.time.addEvent({
      delay: 200,
      callbackScope: this,
      callback: () => {
        this.fly();
      },
    });
  }
}
