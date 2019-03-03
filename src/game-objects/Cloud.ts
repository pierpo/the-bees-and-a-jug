import { Main } from '../scenes/Main';
import { randomIntRange } from '../services/random-range';

export class Cloud extends Phaser.GameObjects.Container {

  public static layouts = [
    [{ x: 65, y: 80, radius: 40 }, { x: 100, y: 70, radius: 50 }, { x: 140, y: 90, radius: 30 }],
    [{ x: 65, y: 80, radius: 30 }, { x: 100, y: 70, radius: 40 }, { x: 140, y: 80, radius: 35 }],
    [
      { x: 45, y: 75, radius: 30 },
      { x: 65, y: 65, radius: 40 },
      { x: 100, y: 70, radius: 30 },
      { x: 130, y: 75, radius: 25 },
    ],
  ];
  protected scene: Main;

  constructor(scene: Main, x: number, y: number) {
    super(scene, x, y);
    this.scene = scene;

    const randomCloud = randomIntRange(0, Cloud.layouts.length - 1);

    Cloud.layouts[randomCloud].map(part => {
      const c = this.scene.add.circle(part.x, part.y, part.radius, 0xffffff);
      this.add(c);
    });

    this.scene.add.existing(this);
  }
}
