import { Honeycomb } from './Honeycomb';

const NUMBER_OF_STORED_POSITIONS = 10;

export class Bee extends Phaser.GameObjects.Arc {
  public matterGameObject: any;
  public scene: Phaser.Scene;

  static RADIUS = 5;
  static THRUST_POWER = 0.05;
  static MASS = 0.4;
  static FRICTION = 0.15;
  static FLY_FREQUENCY = 250;
  static COLOR = 0xffe597;

  private xGoal;
  private yGoal;

  private latestYPositions = [];
  private latestXPositions = [];

  getMass(): number {
    return this.matterGameObject.body.mass;
  }

  getAngle(): number {
    return this.matterGameObject.angle;
  }

  getPositionTendency(): { x: number; y: number } {
    const xPositionTendency =
      this.latestXPositions.reduce((acc, v) => {
        return acc + v;
      }, 0) / this.latestXPositions.length;

    const yPositionTendency =
      this.latestYPositions.reduce((acc, v) => {
        return acc + v;
      }, 0) / this.latestYPositions.length;

    return { x: xPositionTendency, y: yPositionTendency };
  }

  public moveTo(x: number, y: number) {
    // Move with a debounce to not have all the bees at once
    this.scene.time.addEvent({
      delay: 200 * Math.random(),
      callbackScope: this,
      callback: () => {
        this.xGoal = x;
        this.yGoal = y;
      },
    });
  }

  public moveToHoneycomb(honeycomb: Honeycomb) {
    this.moveTo(honeycomb.x, honeycomb.y - 20);
  }

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, Bee.RADIUS, 0, 360, false, Bee.COLOR);
    this.scene = scene;
    this.scene.add.existing(this);

    this.xGoal = x;
    this.yGoal = y;

    this.latestXPositions = Array(NUMBER_OF_STORED_POSITIONS).fill(x);
    this.latestYPositions = Array(NUMBER_OF_STORED_POSITIONS).fill(y);

    this.matterGameObject = this.scene.matter.add.gameObject(this, {
      shape: { type: 'circle', radius: Bee.RADIUS },
    });

    this.matterGameObject.setAngle(90);

    this.matterGameObject.setFrictionAir(Bee.FRICTION);

    this.matterGameObject.setMass(Bee.MASS);

    this.scene.time.addEvent({
      delay: 800 * Math.random(),
      callbackScope: this,
      callback: () => {
        this.fly();
      },
    });
  }

  public preUpdate() {
    this.adjustTrajectory();

    const currentX = this.matterGameObject.body.position.x;
    this.latestXPositions.pop();
    this.latestXPositions.unshift(currentX);

    const currentY = this.matterGameObject.body.position.y;
    this.latestYPositions.pop();
    this.latestYPositions.unshift(currentY);
  }

  private computeVelocityStabilizerAngle(velocityX: number) {
    return 90 + Phaser.Math.RadToDeg(Math.atan(velocityX)) / 2;
  }

  private computeGoalAngle(xDiffToGoal: number) {
    return 90 + Phaser.Math.RadToDeg(Math.atan(xDiffToGoal)) / 2;
  }

  private computeAdjustmentAngle(angle, velocityX) {
    const WEIGHT = 0.5;

    const velocityStabilizerAngle = this.computeVelocityStabilizerAngle(velocityX);

    const xDiffToGoal = this.xGoal - this.matterGameObject.body.position.x;
    const xGoalAngle = this.computeGoalAngle(xDiffToGoal);

    const aimedAngle = (velocityStabilizerAngle + xGoalAngle) / 2;

    return (WEIGHT * (aimedAngle - angle)) / 360;
  }

  private computeThrust() {
    const WEIGHT = 0.08;

    const yPositionTendency = this.getPositionTendency().y;

    const yDiffToGoal = this.yGoal - yPositionTendency;

    const adjustment = (-Math.atan(yDiffToGoal * WEIGHT) * 4) / Phaser.Math.PI2;

    let finalAdjustment = adjustment;
    if (adjustment < 0) {
      finalAdjustment = -adjustment / 4;
    }

    return -finalAdjustment * Bee.THRUST_POWER * this.getMass();
  }

  private adjustTrajectory() {
    const ang = this.getAngle();

    const velX = this.matterGameObject.body.velocity.x;

    const distToIdeal = this.computeAdjustmentAngle(ang, velX);

    this.matterGameObject.setAngularVelocity(distToIdeal);
  }

  private fly() {
    this.matterGameObject.thrust(this.computeThrust());

    this.scene.time.addEvent({
      delay: Bee.FLY_FREQUENCY,
      callbackScope: this,
      callback: () => {
        this.fly();
      },
    });
  }
}
