import { Main } from '../scenes/Main';

export class Flower extends Phaser.GameObjects.Sprite {
  public static SCALE = 0.3;
  protected scene: Main;

  get flowerCorePosition(): { x: number; y: number } {
    const actualHeight = Flower.SCALE * this.height;
    const flowerCoreY = this.y - 0.2 * actualHeight;
    return { x: this.x, y: flowerCoreY };
  }

  constructor(scene: Main, x: number, y: number) {
    super(scene, x, y, 'flower');
    this.scene = scene;

    this.setScale(Flower.SCALE);

    this.scene.add.existing(this);
  }
}
