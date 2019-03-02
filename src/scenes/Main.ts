import { InitialHoneycomb } from '../game-objects/InitialHoneycomb';
import { Bee } from '../game-objects/Bee';
import { BuiltHoneycomb } from '../game-objects/BuiltHoneycomb';
import { Honeycomb } from '../game-objects/Honeycomb';

export class Main extends Phaser.Scene {
  constructor(key: string) {
    super(key);
  }

  static RED_COLOR = 0xffa2a9;

  public leftHoneycombExtremity: Honeycomb;
  public rightHoneycombExtremity: Honeycomb;

  bees: Bee[] = [];

  protected create() {
    this.matter.world.setBounds();

    const rot = Phaser.Math.DegToRad(90);

    const rect1 = this.add.rectangle(200, 400, 100, 10, Main.RED_COLOR);
    this.matter.add.gameObject(rect1, { isStatic: true });

    const rect2 = this.add.rectangle(150, 350, 100, 10, Main.RED_COLOR);
    const react2go = this.matter.add.gameObject(rect2, { isStatic: true });
    // @ts-ignore
    react2go.setRotation(rot);

    const rect3 = this.add.rectangle(250, 350, 100, 10, Main.RED_COLOR);
    const react3go = this.matter.add.gameObject(rect3, { isStatic: true });
    // @ts-ignore
    react3go.setRotation(rot);

    this.initHoneycombs();

    this.bees.push(new Bee(this, 400, 100));
    this.bees.push(new Bee(this, 400, 100));
    this.bees.push(new Bee(this, 400, 100));

    this.bees[0].buildHoneycomb();
    this.bees[1].buildHoneycomb();
    this.bees[2].buildHoneycomb();
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
    const rightToLeftHoneycomb = rightHoneycombPosition.subtract(leftHoneycombPosition);
    const directionBetweenHoneycombs = rightToLeftHoneycomb.normalize();
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

    if (!this.shouldBuildNewHoneycombs()) {
      this.leftHoneycombExtremity.on(BuiltHoneycomb.BUILT_EVENT, () => {
        console.log('The hive is complete!');
      });
    }

    return newHoneycomb;
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
    this.leftHoneycombExtremity = new InitialHoneycomb(this, 150, 300);
  }
}
