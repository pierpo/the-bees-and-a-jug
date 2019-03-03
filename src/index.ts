import 'phaser';
// @ts-ignore
import PhaserMatterCollisionPlugin from 'phaser-matter-collision-plugin';
import { Main } from './scenes/Main';
import { Preloader } from './scenes/Preloader';

class PhaserGame extends Phaser.Game {
  constructor() {
    const config = {
      type: Phaser.AUTO,
      parent: 'game-container',
      width: 600,
      height: 450,
      zoom: 1,
      backgroundColor: '#dbfcff',
      plugins: {
        scene: [
          {
            mapping: 'matterCollision',
            key: 'matterCollision',
            plugin: PhaserMatterCollisionPlugin,
          },
        ],
      },
      physics: {
        default: 'matter',
        matter: {
          debug: true,
          debugShowInternalEdges: true,
          debugShowConvexHulls: true,
        },
      },
      scene: [Preloader, Main],
    };
    super(config);
  }
}

new PhaserGame();
