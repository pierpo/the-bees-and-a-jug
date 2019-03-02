import { InitialHoneycomb } from '../game-objects/InitialHoneycomb';
import { Bee } from '../game-objects/Bee';
import { BuiltHoneycomb } from '../game-objects/BuiltHoneycomb';

export class Main extends Phaser.Scene {
  constructor(key: string) {
    super(key);
  }

  static RED_COLOR = 0xffa2a9;

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

    const rightHoneycomb = new InitialHoneycomb(this, 250, 300);
    const leftHoneycomb = new InitialHoneycomb(this, 150, 300);

    const rightHoneycombPosition = new Phaser.Math.Vector2(rightHoneycomb.x, rightHoneycomb.y);
    const leftHoneycombPosition = new Phaser.Math.Vector2(leftHoneycomb.x, leftHoneycomb.y);

    const rightToLeftHoneycomb = rightHoneycombPosition.subtract(leftHoneycombPosition);
    const distanceBetweenHoneycombs = rightToLeftHoneycomb.length();
    const directionBetweenHoneycombs = rightToLeftHoneycomb.normalize();
    const xDir = directionBetweenHoneycombs.x;
    const yDir = directionBetweenHoneycombs.y;

    const steps = 5;
    const stepLength = distanceBetweenHoneycombs / steps;

    for (let i = 1; i <= steps; ++i) {
      const newHoneycombPosition = directionBetweenHoneycombs.add(
        new Phaser.Math.Vector2(stepLength * xDir, stepLength * yDir),
      );
      new BuiltHoneycomb(
        this,
        leftHoneycomb.x + newHoneycombPosition.x,
        leftHoneycomb.y + newHoneycombPosition.y,
      );
    }

    this.bees.push(new Bee(this, 400, 100));
    this.bees.push(new Bee(this, 400, 70));
    this.bees.push(new Bee(this, 380, 50));

    this.bees[0].moveTo(350, 300);
    this.bees[1].moveTo(350, 300);
    this.bees[2].moveTo(350, 300);

    this.time.addEvent({
      delay: 4000,
      callbackScope: this,
      callback: () => {
        this.bees[0].moveToHoneycomb(rightHoneycomb);
        this.bees[1].moveToHoneycomb(leftHoneycomb);
        this.bees[2].moveToHoneycomb(leftHoneycomb);
      },
    });
  }
}
