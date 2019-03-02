export abstract class Main extends Phaser.Scene {
  constructor(key: string) {
    super(key);
  }

  protected create() {
    this.matter.world.setBounds().disableGravity();

    const arrow = '40 0 40 20 100 20 100 80 40 80 40 100 0 50';

    const poly = this.add.polygon(400, 300, arrow, 0x0000ff, 0.2);

    this.matter.add.gameObject(poly, {
      shape: { type: 'fromVerts', verts: arrow, flagInternal: true },
    });

    // @ts-ignore
    poly.setVelocity(6, 3);
    // @ts-ignore
    poly.setAngularVelocity(0.01);
    // @ts-ignore
    poly.setBounce(1);
    // @ts-ignore
    poly.setFriction(0, 0, 0);
  }
}
