import { Bee } from '../game-objects/Bee';
import { BuiltHoneycomb } from '../game-objects/BuiltHoneycomb';
import { Honeycomb } from '../game-objects/Honeycomb';
import { randomRange } from '../services/random-range';
import { Jug } from '../game-objects/Jug';

export class Main extends Phaser.Scene {
  static RED_COLOR = 0xffc4c8;
  static SCENE_KEY = 'Main';
  static NUMBER_OF_BEES = 10;
  static RANDOM_BUILD_ANGLE_AMPLITUDE = 1.5;

  constructor() {
    super(Main.SCENE_KEY);
  }

  private bees: Bee[] = [];

  private _leftHoneycombExtremity: Honeycomb;
  private _rightHoneycombExtremity: Honeycomb;

  public get leftHoneycombExtremity(): Honeycomb {
    return this._leftHoneycombExtremity;
  }

  public set leftHoneycombExtremity(value: Honeycomb) {
    this._leftHoneycombExtremity = value;
  }

  public get rightHoneycombExtremity(): Honeycomb {
    return this._rightHoneycombExtremity;
  }
  public set rightHoneycombExtremity(value: Honeycomb) {
    this._rightHoneycombExtremity = value;
  }

  protected create() {
    const flower = this.add.sprite(400, 300, 'flower');
    flower.setScale(0.3);
    this.matter.world.setBounds();

    new Jug(this);

    const newRandomBee = () => {
      return new Bee(this, 400 + randomRange(-30, 30), 100 + randomRange(-30, 30));
    };

    this.bees = Array(Main.NUMBER_OF_BEES)
      .fill(0)
      .map(newRandomBee);

    this.bees.forEach(bee => {
      this.time.addEvent({
        delay: 8000 * Math.random(),
        callbackScope: this,
        callback: () => {
          bee.buildHoneycomb();
        },
      });
    });
  }

  public tryNewLeftHoneycomb(): BuiltHoneycomb {
    if (!this.shouldBuildNewHoneycombs() && this.leftHoneycombExtremity instanceof BuiltHoneycomb) {
      return this.leftHoneycombExtremity;
    }

    const rightHoneycombPosition = new Phaser.Math.Vector2(
      this.rightHoneycombExtremity.x,
      this.rightHoneycombExtremity.y,
    );
    const leftHoneycombPosition = new Phaser.Math.Vector2(
      this.leftHoneycombExtremity.x,
      this.leftHoneycombExtremity.y,
    );
    const leftToRightHoneycomb = rightHoneycombPosition.subtract(leftHoneycombPosition);
    const directionBetweenHoneycombs = leftToRightHoneycomb.normalize();

    const randomDeltaAngle = randomRange(
      -Main.RANDOM_BUILD_ANGLE_AMPLITUDE,
      Main.RANDOM_BUILD_ANGLE_AMPLITUDE,
    );

    const newRandomAngle = leftToRightHoneycomb.angle() + randomDeltaAngle;
    directionBetweenHoneycombs.setToPolar(newRandomAngle);
    const xDir = directionBetweenHoneycombs.x;
    const yDir = directionBetweenHoneycombs.y;
    const stepLength = 2 * BuiltHoneycomb.RADIUS;
    const newHoneycombPosition = directionBetweenHoneycombs.add(
      new Phaser.Math.Vector2(stepLength * xDir, stepLength * yDir),
    );

    const newHoneycomb = new BuiltHoneycomb(
      this,
      this.leftHoneycombExtremity.x + newHoneycombPosition.x,
      this.leftHoneycombExtremity.y + newHoneycombPosition.y,
    );
    this.leftHoneycombExtremity = newHoneycomb;

    const unsubscribeList = { list: [] };
    const unsubscribeAll = () => {
      unsubscribeList.list.forEach(unsubscribe => unsubscribe());
    };

    unsubscribeList.list = this.bees.map(bee => {
      // @ts-ignore
      return this.matterCollision.addOnCollideStart({
        objectA: bee,
        objectB: this.leftHoneycombExtremity,
        callback: eventData => {
          // @ts-ignore
          const { gameObjectB } = eventData;

          gameObjectB.hasBeenTouchedByBee = true;
          unsubscribeAll();
        },
      });
    });

    if (this.isHiveComplete()) {
      this.leftHoneycombExtremity.on(BuiltHoneycomb.BUILT_EVENT, () => {
        console.log('The hive is complete!');
      });
    }

    return newHoneycomb;
  }

  public isHiveComplete(): boolean {
    const newDistance = new Phaser.Math.Vector2(
      this.leftHoneycombExtremity.x,
      this.leftHoneycombExtremity.y,
    )
      .subtract(
        new Phaser.Math.Vector2(this.rightHoneycombExtremity.x, this.rightHoneycombExtremity.y),
      )
      .length();

    return newDistance < 2 * BuiltHoneycomb.RADIUS;
  }

  public shouldBuildNewHoneycombs(): boolean {
    if (!(this.leftHoneycombExtremity instanceof BuiltHoneycomb)) {
      return true;
    }

    const newDistance = new Phaser.Math.Vector2(
      this.leftHoneycombExtremity.x,
      this.leftHoneycombExtremity.y,
    )
      .subtract(
        new Phaser.Math.Vector2(this.rightHoneycombExtremity.x, this.rightHoneycombExtremity.y),
      )
      .length();

    const isFarEnough = newDistance >= 2 * BuiltHoneycomb.RADIUS;
    const isCurrentHoneycombComplete = this.leftHoneycombExtremity.isComplete;

    return isFarEnough && isCurrentHoneycombComplete;
  }
}
