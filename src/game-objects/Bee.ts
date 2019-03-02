import { Main } from '../scenes/Main';

export class Bee extends Phaser.GameObjects.Arc {
  public matterGameObject: Phaser.GameObjects.GameObject;
  public scene: Phaser.Scene;

  static RADIUS = 15;

  getMass(): number {
    // @ts-ignore
    return this.matterGameObject.body.mass;
  }

  getAngle(): number {
    // @ts-ignore
    return this.matterGameObject.angle;
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
    this.matterGameObject.setAngle(60);

    // @ts-ignore
    this.matterGameObject.setFrictionAir(0.15);

    // @ts-ignore
    this.matterGameObject.applyForce(new Phaser.Math.Vector2(-0.08 * this.getMass(), 0));
    this.fly();
  }

  public update() {
    this.adjustTrajectory();
  }

  public stabilize() {
    const ang = this.getAngle();
    const distToIdeal = -(0.1 * (ang - 90)) / 360;
    // @ts-ignore
    this.matterGameObject.setAngularVelocity(distToIdeal);

    console.log('angle: ', ang);
    // if (ang > 100) {
    //   // @ts-ignore
    //   this.matterGameObject.setAngularVelocity(-0.1 * distToIdeal);
    // }
    // if (ang < 80) {
    //   // @ts-ignore
    //   this.matterGameObject.setAngularVelocity(0.1 * distToIdeal);
    // }
  }

  public adjustTrajectory() {
    // @ts-ignore
    const ang = this.getAngle();
    // @ts-ignore
    const velX = this.matterGameObject.body.velocity.x;

    // console.log('velX: ', velX);

    const distToIdeal = (0.1 * (90 - ang)) / 360 - velX / 10;
    console.log('distToIdeal: ', distToIdeal);
    // @ts-ignore
    this.matterGameObject.setAngularVelocity(distToIdeal);

    if (velX < 0) {
      // @ts-ignore
      // this.matterGameObject.setAngularVelocity(0.1);
    } else {
      // @ts-ignore
      // this.matterGameObject.setAngularVelocity(-0.1);
    }
  }

  private fly() {
    // @ts-ignore
    this.matterGameObject.thrust(-0.01 * this.getMass());

    this.scene.time.addEvent({
      delay: 200,
      callbackScope: this,
      callback: () => {
        this.fly();
      },
    });
  }
}
