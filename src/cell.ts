import { Graphics, Container, ContainerOptions } from "pixi.js";
import { drawInterpolatedLine } from "./interpolated-line";
import { MyPoint } from "./point";
import { drawBlockyLine } from "./blocky-line";

const RECT_WIDTH = 30;

export class RectText extends Container {
  rectWidth = RECT_WIDTH;
  // textGrid = new Text();
  points: Array<MyPoint> = [];
  myLines = new Graphics();
  gridValue = 0;
  grid = new Graphics();
  interpolate = true;
  constructor({
    text,
    x,
    y,
    resolution,
    gridVisible,
    pointVisible,
    interpolate,
    ...args
  }: ContainerOptions & {
    text: string;
    x: number;
    y: number;
    resolution: number;
    gridVisible: boolean;
    pointVisible: boolean;
    interpolate: boolean;
  }) {
    super(args);
    this.rectWidth = resolution ?? this.rectWidth;
    this.x = x * this.rectWidth;
    this.y = y * this.rectWidth;
    this.interpolate = interpolate ?? this.interpolate;

    // this.textGrid.anchor = { x: 0.5, y: 0.5 };
    // this.textGrid.x = this.rectWidth / 2;
    // this.textGrid.y = this.rectWidth / 2;
    // this.textGrid.zIndex = 20;
    // this.textGrid.style = { fontSize: 12, fill: "yellow" };
    // this.textGrid.text = this.gridValue;
    // this.addChild(this.textGrid);

    this.grid.rect(0, 0, this.rectWidth, this.rectWidth);
    this.grid.stroke({ color: "white", width: 1 });
    this.grid.visible = gridVisible;
    this.addChild(this.grid);
    this.addChild(this.myLines);
    this.setupPoint(pointVisible);
  }

  setupPoint(pointVisible: boolean) {
    this.points = [
      new MyPoint({
        x: 0,
        y: 0,
        label: `${this.label}-nw`,
        visible: pointVisible,
        render: true,
      }),
      new MyPoint({
        x: this.rectWidth,
        y: 0,
        label: `${this.label}-ne`,
        visible: false,
      }),
      new MyPoint({
        x: this.rectWidth,
        y: this.rectWidth,
        label: `${this.label}-se`,
        visible: false,
      }),
      new MyPoint({
        x: 0,
        y: this.rectWidth,
        label: `${this.label}-sw`,
        visible: false,
      }),
    ];
    this.addChild(...this.points);
  }
  updateGridValue() {
    const x = this.points;
    const b = x.map((p) => (p.isOn ? "1" : 0)).join("");
    const int = parseInt(b, 2);
    // this.textGrid.text = b;
    this.gridValue = int;
    this.drawLine(int);
  }

  togglePoints() {
    for (let i = 0; i < this.points.length; i++) {
      this.points[i].visible = !this.points[i].visible;
    }
  }

  toggleGrid() {
    this.grid.visible = !this.grid.visible;
  }

  toggleInterpolate() {
    this.interpolate = !this.interpolate;
  }

  drawLine(val: number) {
    const l = this.myLines;
    l.clear();
    l.zIndex = val;
    if (this.interpolate) {
      drawInterpolatedLine({
        l,
        int: val,
        squareWidth: this.rectWidth,
        nw: this.points[0].myValue,
        ne: this.points[1].myValue,
        se: this.points[2].myValue,
        sw: this.points[3].myValue,
      });
    } else {
      drawBlockyLine(val, l, this.rectWidth);
    }
    l.stroke({ color: "purple", width: 2 });
  }
}
