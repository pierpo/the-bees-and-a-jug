import { Main } from '../scenes/Main';
import { InitialHoneycomb } from './InitialHoneycomb';
import { randomIntRange } from '../services/random-range';

export class Jug {
  public static COLOR = 0xffc4c8;
  public static RADIUS = 5;
  public static NUMBER_OF_CIRCLES = 150;
  private scene: Main;
  private lowCutoffThreshold: number;
  private highCutoffThreshold: number;

  constructor(scene: Main) {
    this.scene = scene;

    this.setRandomCutoff();

    const { firstCutoff, lastCutoff } = this.initJug();
    this.initHoneycombs(firstCutoff, lastCutoff);
  }

  private setRandomCutoff(): void {
    const a = Jug.NUMBER_OF_CIRCLES / 7;
    this.lowCutoffThreshold = randomIntRange(0 * a, 0.2 * a);
    this.highCutoffThreshold = randomIntRange(1.7 * a, 2 * a);
  }

  private hasPassedLowCutoff(step: number): boolean {
    return step > this.lowCutoffThreshold;
  }

  private hasntPassedHighCutoff(step: number): boolean {
    return step < this.highCutoffThreshold;
  }

  private initHoneycombs(pos1, pos2) {
    this.scene.rightHoneycombExtremity = new InitialHoneycomb(this.scene, pos1.x, pos1.y);
    this.scene.leftHoneycombExtremity = new InitialHoneycomb(this.scene, pos2.x, pos2.y);
  }

  private initJug() {
    const path = new Phaser.Curves.Path(143.63632022470475, 197.96526097467898);
    path.splineTo([
      new Phaser.Math.Vector2(143.63632022470475, 197.96526097467898),
      new Phaser.Math.Vector2(156.97033644416155, 183.0955695069384),
      new Phaser.Math.Vector2(167.67984999399863, 166.23201861348147),
      new Phaser.Math.Vector2(173.08608116127104, 147.12699649530077),
      new Phaser.Math.Vector2(171.3923870871951, 127.23176499701732),
      new Phaser.Math.Vector2(166.15324097383805, 107.96853979749993),
      new Phaser.Math.Vector2(157.59103674428115, 89.90950575111117),
      new Phaser.Math.Vector2(146.52739704301385, 73.26729035774358),
      new Phaser.Math.Vector2(139.65752631195534, 54.5971513830593),
      new Phaser.Math.Vector2(140.12302507761345, 34.68152514364613),
      new Phaser.Math.Vector2(145.26326484652725, 15.419588201431353),
      new Phaser.Math.Vector2(161.11797723265826, 19.573684144142224),
      new Phaser.Math.Vector2(154.75545411543152, 4.10217759186373),
      new Phaser.Math.Vector2(135.19108255849468, 2.2073978812451167),
      new Phaser.Math.Vector2(115.19312060123482, 2.358441156121776),
      new Phaser.Math.Vector2(95.19099031813955, 2.5338595236706127),
      new Phaser.Math.Vector2(75.20336842046514, 2.719415626825063),
      new Phaser.Math.Vector2(55.195044632359114, 2.9121050540282636),
      new Phaser.Math.Vector2(58.488267791557405, 16.744857517809308),
      new Phaser.Math.Vector2(61.541962224724216, 36.34498589463826),
      new Phaser.Math.Vector2(56.91436715860616, 55.57789043220127),
      new Phaser.Math.Vector2(48.48015370217852, 73.70795303790118),
      new Phaser.Math.Vector2(39.91426031512848, 91.77360256521823),
      new Phaser.Math.Vector2(32.63805608633316, 110.36910413590503),
      new Phaser.Math.Vector2(28.627318266066712, 129.95610735756983),
      new Phaser.Math.Vector2(28.996117645904853, 149.88183939694932),
      new Phaser.Math.Vector2(35.25831740784733, 168.8002695974322),
      new Phaser.Math.Vector2(45.95098718797055, 185.66738671362185),
      new Phaser.Math.Vector2(62.16493341847142, 196.9496704604187),
      new Phaser.Math.Vector2(81.49484925596346, 201.95186880464234),
      new Phaser.Math.Vector2(101.4167221668956, 203.2226293685911),
      new Phaser.Math.Vector2(121.42440616218028, 202.840861450013),
      new Phaser.Math.Vector2(140.98954553149417, 199.06503322509764),
    ]);

    const hance = new Phaser.Curves.Path(55.18231326072216, 56.60452209766673);
    hance.splineTo([
      new Phaser.Math.Vector2(55.18231326072216, 56.60452209766673),
      new Phaser.Math.Vector2(39.04473311324879, 45.09883611482604),
      new Phaser.Math.Vector2(19.621172856373544, 44.967357002103476),
      new Phaser.Math.Vector2(6.36046608110056, 59.41070444536972),
      new Phaser.Math.Vector2(2.7885462329202984, 78.90979206378621),
      new Phaser.Math.Vector2(7.198395426202023, 98.33614735313462),
      new Phaser.Math.Vector2(15.100426897676853, 116.70132177015826),
      new Phaser.Math.Vector2(24.95479876832636, 134.07503071333656),
      new Phaser.Math.Vector2(31.428573151327342, 122.1579744720212),
      new Phaser.Math.Vector2(37.38543672186547, 103.06397199943476),
      new Phaser.Math.Vector2(43.999634009795166, 84.18748706499139),
      new Phaser.Math.Vector2(51.320084666501806, 65.57874234929355),
    ]);

    const offset = { x: 60, y: 180 };

    Array(Jug.NUMBER_OF_CIRCLES)
      .fill(0)
      .map((_, index) => {
        const currentPointInPath = hance.getPoint(index / Jug.NUMBER_OF_CIRCLES);
        const newCircle = this.scene.add.circle(
          currentPointInPath.x + offset.x,
          currentPointInPath.y + offset.y,
          5,
          Jug.COLOR,
        );
        return this.scene.matter.add.gameObject(newCircle, { isStatic: true });
      });

    let firstCutoff = null;
    let lastCutoff = null;
    Array(Jug.NUMBER_OF_CIRCLES)
      .fill(0)
      .map((_, index) => {
        const currentPointInPath = path.getPoint(index / Jug.NUMBER_OF_CIRCLES);
        const hasPassedLowCutoffStep = this.hasPassedLowCutoff(index);
        if (hasPassedLowCutoffStep) {
          firstCutoff = firstCutoff || {
            x: currentPointInPath.x + offset.x,
            y: currentPointInPath.y + offset.y,
          };
        }
        const hasntPassedHighCutoffStep = this.hasntPassedHighCutoff(index);
        if (!hasntPassedHighCutoffStep) {
          lastCutoff = lastCutoff || {
            x: currentPointInPath.x + offset.x,
            y: currentPointInPath.y + offset.y,
          };
        }

        if (hasPassedLowCutoffStep && hasntPassedHighCutoffStep) {
          return;
        }
        const newCircle = this.scene.add.circle(
          currentPointInPath.x + offset.x,
          currentPointInPath.y + offset.y,
          Jug.RADIUS,
          Jug.COLOR,
        );
        return this.scene.matter.add.gameObject(newCircle, { isStatic: true });
      });

    return {
      firstCutoff,
      lastCutoff,
    };
  }
}
