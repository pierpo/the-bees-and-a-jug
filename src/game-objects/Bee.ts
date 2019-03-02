import { Main } from '../scenes/Main';

export class Bee extends Phaser.GameObjects.Arc {
  public matterGameObject: Phaser.GameObjects.GameObject;
  public scene: Phaser.Scene;

  static RADIUS = 15;
  static THRUST_POWER = 0.02;
  static MASS = 0.5;

  private xGoal = 100;

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
    this.matterGameObject.setFrictionAir(0.15);

    // @ts-ignore
    this.matterGameObject.setMass(Bee.MASS);

    this.fly();
  }

  public update() {
    this.adjustTrajectory();
  }

  public computeVelocityStabilizerAngle(velocityX: number) {
    return 90 + Phaser.Math.RadToDeg(Math.atan(velocityX)) / 2;
  }

  public computeGoalAngle(xDiffToGoal: number) {
    return 90 + Phaser.Math.RadToDeg(Math.atan(xDiffToGoal)) / 2;
  }

  public computeAdjustmentAngle(angle, velocityX) {
    const WEIGHT = 0.5;

    const velocityStabilizerAngle = this.computeVelocityStabilizerAngle(velocityX);

    // @ts-ignore
    const xDiffToGoal = this.xGoal - this.matterGameObject.body.position.x;
    const xGoalAngle = this.computeGoalAngle(xDiffToGoal);

    const aimedAngle = (velocityStabilizerAngle + xGoalAngle) / 2;

    return (WEIGHT * (aimedAngle - angle)) / 360;
  }

  public adjustTrajectory() {
    // @ts-ignore
    const ang = this.getAngle();

    // @ts-ignore
    const velX = this.matterGameObject.body.velocity.x;

    const distToIdeal = this.computeAdjustmentAngle(ang, velX);

    // @ts-ignore
    this.matterGameObject.setAngularVelocity(distToIdeal);
  }

  private fly() {
    // @ts-ignore
    this.matterGameObject.thrust(-Bee.THRUST_POWER * this.getMass());

    this.scene.time.addEvent({
      delay: 200,
      callbackScope: this,
      callback: () => {
        this.fly();
      },
    });
  }
}
