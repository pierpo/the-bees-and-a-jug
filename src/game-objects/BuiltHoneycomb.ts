import { Honeycomb } from './Honeycomb';

export class BuiltHoneycomb extends Honeycomb {
  public matterGameObject: any;
  public scene: Phaser.Scene;

  static BUILT_EVENT = 'built';

  static RADIUS = 2;
  static MAX_RADIUS = 10;
  static GROW_SPEED = 0.005;
  static COLOR = 0xffe597;

  private scale = 1;
  private _hasBeenTouchedByBee = false;
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, BuiltHoneycomb.RADIUS, 0, 360, false, BuiltHoneycomb.COLOR);
    this.scene = scene;

    scene.add.existing(this);

    this.matterGameObject = this.scene.matter.add.gameObject(this, {
      shape: { type: 'circle', radius: BuiltHoneycomb.RADIUS },
      isStatic: true,
    });

    this.setAlpha(0);
  }

  public preUpdate() {
    if (this.shouldGrow()) {
      this.setAlpha(1);
      this.grow();
    }
  }

  private shouldGrow(): boolean {
    if (!this.hasBeenTouchedByBee) return false;

    const maxScale = BuiltHoneycomb.MAX_RADIUS / BuiltHoneycomb.RADIUS;
    return this.scale < maxScale;
  }

  public grow() {
    const step = (BuiltHoneycomb.MAX_RADIUS - BuiltHoneycomb.RADIUS) * BuiltHoneycomb.GROW_SPEED;
    this.scale += step;

    this.matterGameObject.setScale(this.scale);

    if (!this.shouldGrow()) {
      this.emit(BuiltHoneycomb.BUILT_EVENT);
    }
  }

  public get hasBeenTouchedByBee() {
    return this._hasBeenTouchedByBee;
  }
  public set hasBeenTouchedByBee(value) {
    console.log('YES');
    this._hasBeenTouchedByBee = value;
  }
}
