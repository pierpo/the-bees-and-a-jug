import 'phaser';
import { Main } from './scenes/Main';

class PhaserGame extends Phaser.Game {
  constructor() {
    const config = {
      type: Phaser.AUTO,
      parent: 'game-container',
      width: 600,
      height: 450,
      zoom: 1,
      backgroundColor: '#00ff00',
      physics: {
        default: 'matter',
        matter: {
          debug: true,
          debugShowInternalEdges: true,
          debugShowConvexHulls: true,
        },
      },
      scene: [Main],
    };
    super(config);
  }
}

// tslint:disable-next-line
new PhaserGame();
