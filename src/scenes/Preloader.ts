import { Main } from './Main';

export class Preloader extends Phaser.Scene {
  protected preload() {
    this.load.image('bee', 'assets/bee.png');
    this.load.image('flower', 'assets/flower.png');
  }

  protected create() {
    this.scene.launch(Main.SCENE_KEY);
  }
}
