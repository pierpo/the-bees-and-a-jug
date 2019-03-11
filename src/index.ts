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
      width: 800,
      height: 450,
      zoom: 1,
      backgroundColor: '#dbfcff',
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
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
          debug: false,
          debugShowInternalEdges: false,
          debugShowConvexHulls: false,
        },
      },
      scene: [Preloader, Main],
    };
    super(config);
  }
}

// tslint:disable-next-line
new PhaserGame();
