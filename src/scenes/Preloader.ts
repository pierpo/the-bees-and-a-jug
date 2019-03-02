export class Preloader extends Phaser.Scene {
  protected preload() {
    this.load.image('bee', 'assets/bee.png');
  }

  protected create() {
    this.scene.launch('Main');
  }
}
