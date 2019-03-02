import { Honeycomb } from './Honeycomb';

export class BuiltHoneycomb extends Honeycomb {
  public matterGameObject: any;
  public scene: Phaser.Scene;

  static RADIUS = 2;
  static MAX_RADIUS = 10;
  static GROW_SPEED = 0.005;
  static COLOR = 0xffe597;

  private scale = 1;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, BuiltHoneycomb.RADIUS, 0, 360, false, BuiltHoneycomb.COLOR);
    this.scene = scene;

    scene.add.existing(this);

    this.matterGameObject = this.scene.matter.add.gameObject(this, {
      shape: { type: 'circle', radius: BuiltHoneycomb.RADIUS },
      isStatic: true,
    });

    this.grow();
  }

  public preUpdate() {
    this.grow();
  }

  public grow() {
    const step = (BuiltHoneycomb.MAX_RADIUS - BuiltHoneycomb.RADIUS) * BuiltHoneycomb.GROW_SPEED;
    const maxScale = BuiltHoneycomb.MAX_RADIUS / BuiltHoneycomb.RADIUS;
    if (this.scale >= maxScale) return;
    this.scale += step;

    this.matterGameObject.setScale(this.scale);
  }
}
