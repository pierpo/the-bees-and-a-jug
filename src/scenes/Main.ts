import { InitialHoneycomb } from '../game-objects/InitialHoneycomb';
import { Bee } from '../game-objects/Bee';
import { BuiltHoneycomb } from '../game-objects/BuiltHoneycomb';
import { Honeycomb } from '../game-objects/Honeycomb';
import { randomRange } from '../services/random-range';

export class Main extends Phaser.Scene {
  static RED_COLOR = 0xffc4c8;
  static SCENE_KEY = 'Main';
  static NUMBER_OF_BEES = 10;

  constructor() {
    super(Main.SCENE_KEY);
  }

  public leftHoneycombExtremity: Honeycomb;
  public rightHoneycombExtremity: Honeycomb;

  bees: Bee[] = [];

  protected create() {
    this.matter.world.setBounds();

    this.initRectangles();

    this.initHoneycombs();

    const newRandomBee = () => {
      return new Bee(this, 400 + randomRange(-30, 30), 100 + randomRange(-30, 30));
    };

    this.bees = Array(Main.NUMBER_OF_BEES)
      .fill(0)
      .map(newRandomBee);

    this.bees.forEach(bee => {
      this.time.addEvent({
        delay: 3000 * Math.random(),
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

    const randomAngleAmplitude = 2;
    const randomDeltaAngle = Math.random() * randomAngleAmplitude - randomAngleAmplitude / 2;

    const newRandomAngle = leftToRightHoneycomb.angle() + randomDeltaAngle;
    directionBetweenHoneycombs.setToPolar(newRandomAngle);
    const xDir = directionBetweenHoneycombs.x;
    const yDir = directionBetweenHoneycombs.y;
    const stepLength = 2 * BuiltHoneycomb.MAX_RADIUS;
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

    return newDistance < 2 * BuiltHoneycomb.MAX_RADIUS;
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

    const isFarEnough = newDistance >= 2 * BuiltHoneycomb.MAX_RADIUS;
    const isCurrentHoneycombComplete = this.leftHoneycombExtremity.isComplete;

    return isFarEnough && isCurrentHoneycombComplete;
  }

  private initHoneycombs() {
    this.rightHoneycombExtremity = new InitialHoneycomb(this, 250, 300);
    this.leftHoneycombExtremity = new InitialHoneycomb(this, 150, 250);
  }

  private initRectangles() {
    const rot = Phaser.Math.DegToRad(90);
    const ground = this.add.rectangle(200, 400, 100, 10, Main.RED_COLOR);
    this.matter.add.gameObject(ground, { isStatic: true });
    const left = this.add.rectangle(150, 325, 150, 10, Main.RED_COLOR);
    const leftGO = this.matter.add.gameObject(left, { isStatic: true });
    // @ts-ignore
    leftGO.setRotation(rot);
    const right = this.add.rectangle(250, 350, 100, 10, Main.RED_COLOR);
    const rightGO = this.matter.add.gameObject(right, { isStatic: true });
    // @ts-ignore
    rightGO.setRotation(rot);
  }
}
