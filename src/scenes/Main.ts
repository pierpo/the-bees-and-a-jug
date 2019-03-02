import { Honeycomb } from '../game-objects/Honeycomb';
import { Bee } from '../game-objects/Bee';

export class Main extends Phaser.Scene {
  constructor(key: string) {
    super(key);
  }

  static YELLOW_COLOR = 0xffe597;
  static RED_COLOR = 0xffa2a9;

  bees: Bee[] = [];

  protected create() {
    this.matter.world.setBounds();
    // this.matter.world.disableGravity();

    // const arrow = '40 0 40 20 100 20 100 80 40 80 40 100 0 50';

    // const poly = this.add.polygon(400, 300, arrow, yellowColor);

    // this.matter.add.gameObject(poly, {
    //   shape: { type: 'fromVerts', verts: arrow, flagInternal: true },
    // });

    // poly.setVelocity(6, 3);
    // poly.setAngularVelocity(0.01);
    // poly.setFriction(0.1, 0.1, 0.1);

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

    const honeycomb1 = new Honeycomb(this, 250, 300);
    const honeycomb2 = new Honeycomb(this, 150, 300);

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
        // this.bees[1].moveTo(150, 100);
        // this.bees[2].moveTo(150, 100);
        this.bees[0].moveToHoneycomb(honeycomb1);
        this.bees[1].moveToHoneycomb(honeycomb2);
        this.bees[2].moveToHoneycomb(honeycomb2);
      },
    });
  }

  public update() {
    this.bees.map(bee => {
      bee.update();
    });
  }
}
