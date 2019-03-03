import { Main } from '../scenes/Main';

export class Flower extends Phaser.GameObjects.Sprite {
  protected scene: Main;
  private scale: number;

  get flowerCorePosition(): { x: number; y: number } {
    const actualHeight = this.scale * this.height;
    const flowerCoreY = this.y - 0.2 * actualHeight;
    return { x: this.x, y: flowerCoreY };
  }

  constructor(scene: Main, x: number, floorY: number, scale: number = 0.3) {
    super(scene, x, floorY, 'flower');
    this.scene = scene;
    this.scale = scale;
    this.y = floorY - (this.height * this.scale) / 2;

    this.setScale(scale);

    this.scene.add.existing(this);
  }
}
