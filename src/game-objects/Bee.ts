import { Honeycomb } from './Honeycomb';
import { BuiltHoneycomb } from './BuiltHoneycomb';
import { Main } from '../scenes/Main';
import { randomRange } from '../services/random-range';

const NUMBER_OF_STORED_POSITIONS = 10;

export class Bee extends Phaser.GameObjects.Sprite {

  public static HAS_ARRIVED_EVENT = 'has-arrived';

  public static SPRITE_SCALE = 0.25;

  public static RADIUS = 7;
  public static THRUST_POWER = 0.05;
  public static MASS = 0.6;
  public static FRICTION = 0.15;
  public static FLY_FREQUENCY = 250;
  public static COLOR = 0xf9de8f;

  public static WAYPOINT_1 = { x: 500, y: 50 };
  public static WAYPOINT_2 = { x: 400, y: 300 };
  public matterGameObject: any;
  public scene: Main;

  private xGoal;
  private yGoal;

  private latestYPositions = [];
  private latestXPositions = [];

  constructor(scene: Main, x: number, y: number) {
    super(scene, x, y, 'bee');
    this.scene = scene;
    this.setScale(Bee.SPRITE_SCALE);
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

  public getMass(): number {
    return this.matterGameObject.body.mass;
  }

  public getAngle(): number {
    return this.matterGameObject.angle;
  }

  public getPositionTendency(): { x: number; y: number } {
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

  public moveTo(x: number, y: number): Promise<void> {
    return new Promise(resolve => {
      this.xGoal = x;
      this.yGoal = y;

      const hasArrivedAction = () => {
        this.off(Bee.HAS_ARRIVED_EVENT, hasArrivedAction);
        resolve();
      };

      this.on(Bee.HAS_ARRIVED_EVENT, hasArrivedAction);
    });
  }

  public moveToHoneycomb(honeycomb: Honeycomb): Promise<void> {
    return this.moveTo(honeycomb.x, honeycomb.y - BuiltHoneycomb.RADIUS * 2);
  }

  public buildHoneycomb() {
    const honeycomb = this.scene.tryNewLeftHoneycomb();

    this.moveToHoneycomb(honeycomb).then();

    const goToFlower = () => {
      this.moveTo(
        Bee.WAYPOINT_1.x + randomRange(-40, 40),
        Bee.WAYPOINT_1.y + randomRange(-40, 40),
      ).then(() => {
        return this.moveTo(
          Bee.WAYPOINT_2.x + randomRange(-40, 40),
          Bee.WAYPOINT_2.y + randomRange(-40, 40),
        ).then(() => {
          if (this.scene.isHiveComplete()) { return; }
          this.buildHoneycomb();
        });
      });
    };

    honeycomb.on(BuiltHoneycomb.BUILT_EVENT, goToFlower);
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
    const DOWN_DIRECTION_WEIGHT = 0.2;
    const UPWARDS_BOOST = 1.3;

    const yPositionTendency = this.getPositionTendency().y;

    const yDiffToGoal = this.yGoal - yPositionTendency;

    const adjustment = (-Math.atan(yDiffToGoal * WEIGHT) * 4) / Phaser.Math.PI2;

    let finalAdjustment = adjustment;
    if (adjustment < 0) {
      finalAdjustment = -adjustment * DOWN_DIRECTION_WEIGHT;
    }

    const velocityY = this.matterGameObject.body.velocity.y;
    if (velocityY > 1) {
      finalAdjustment *= UPWARDS_BOOST;
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
    this.checkHasArrived();

    this.scene.time.addEvent({
      delay: Bee.FLY_FREQUENCY,
      callbackScope: this,
      callback: () => {
        this.fly();
      },
    });
  }

  private checkHasArrived(): void {
    const { x, y } = this.getPositionTendency();

    const isXOkay = Math.abs(x - this.xGoal) < 2 * Bee.RADIUS;
    const isYOkay = Math.abs(y - this.yGoal) < 2 * Bee.RADIUS;

    if (isXOkay && isYOkay) {
      this.emit(Bee.HAS_ARRIVED_EVENT);
    }
  }
}
