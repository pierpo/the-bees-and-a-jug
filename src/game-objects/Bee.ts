import { Main } from '../scenes/Main';

const NUMBER_OF_STORED_POSITIONS = 10;

export class Bee extends Phaser.GameObjects.Arc {
  public matterGameObject: Phaser.GameObjects.GameObject;
  public scene: Phaser.Scene;

  static RADIUS = 5;
  static THRUST_POWER = 0.02;
  static MASS = 0.5;

  private xGoal;
  private yGoal;

  private latestYPositions = [];

  getMass(): number {
    // @ts-ignore
    return this.matterGameObject.body.mass;
  }

  getAngle(): number {
    // @ts-ignore
    return this.matterGameObject.angle;
  }

  public moveTo(x: number, y: number) {
    this.xGoal = x;
    this.yGoal = y;
  }

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, Bee.RADIUS, 0, 360, false, Main.YELLOW_COLOR);
    this.scene = scene;
    this.scene.add.existing(this);

    this.xGoal = x;
    this.yGoal = y;

    this.latestYPositions = Array(NUMBER_OF_STORED_POSITIONS).fill(y);

    // @ts-ignore
    this.matterGameObject = this.scene.matter.add.gameObject(this, {
      shape: { type: 'circle', radius: Bee.RADIUS },
    });

    // @ts-ignore
    this.matterGameObject.setFrictionAir(0.15);

    // @ts-ignore
    this.matterGameObject.setMass(Bee.MASS);

    this.fly();

    this.scene.time.addEvent({
      delay: 1000 * Math.random(),
      callbackScope: this,
      callback: () => {
        this.fly();
      },
    });
  }

  public update() {
    this.adjustTrajectory();

    // @ts-ignore
    const currentY = this.matterGameObject.body.position.y;
    this.latestYPositions.pop();
    this.latestYPositions.unshift(currentY);
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

  public computeThrust() {
    const WEIGHT = 0.1;

    const yPositionTendency =
      this.latestYPositions.reduce((acc, v) => {
        return acc + v;
      }, 0) / this.latestYPositions.length;

    // @ts-ignore
    const yDiffToGoal = this.yGoal - yPositionTendency;

    const adjustment = (-Math.atan(yDiffToGoal * WEIGHT) * 4) / Phaser.Math.PI2;

    return -adjustment * Bee.THRUST_POWER * this.getMass();
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
    this.matterGameObject.thrust(this.computeThrust());

    this.scene.time.addEvent({
      delay: 200,
      callbackScope: this,
      callback: () => {
        this.fly();
      },
    });
  }
}
