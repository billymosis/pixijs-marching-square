import statsx from "stats.js";
import {
  Graphics,
  Application,
  Container,
  ContainerOptions,
  Ticker,
  GraphicsOptions,
} from "pixi.js";
import { drawInterpolatedLine } from "./interpolated-line";
import { generate2dArray } from "./utils";

class Circle extends Container {
  r = 50 + Math.floor(Math.random() * 100);
  r2 = this.r ** 2;
  vx = 2 * Math.random() - 1;
  vy = 2 * Math.random() - 1;
  constructor(args?: ContainerOptions & { r?: number }) {
    super(args);
    const c = new Graphics();
    this.r = args?.r ?? this.r;
    this.r2 = this.r ** 2;
    c.circle(0, 0, this.r);
    c.stroke({
      width: 2,
      color: "red",
      alpha: 0.2,
    });
    this.addChild(c);
  }
}

class MyPoint extends Container {
  myValue = 0;
  isOn = false;
  circle = new Graphics();
  constructor(args: GraphicsOptions) {
    super(args);
    this.circle.circle(0, 0, 5);
    this.addChild(this.circle);
  }
  setValue(n: number) {
    this.myValue = n;
    if (this.myValue > 1) {
      this.isOn = true;
      if (!this.circle.visible) return;
      this.circle.clear().circle(0, 0, 5).fill({ color: "red" });
    } else {
      this.isOn = false;
      if (!this.circle.visible) return;
      this.circle.clear().circle(0, 0, 5).fill({ color: "blue" });
    }
  }
}

const RECT_WIDTH = 30;

class RectText extends Container {
  rectWidth = RECT_WIDTH;
  // textGrid = new Text();
  points: Array<MyPoint> = [
    new MyPoint({ x: 0, y: 0, label: `${this.label}-nw` }),
    new MyPoint({ x: this.rectWidth, y: 0, label: `${this.label}-ne` }),
    new MyPoint({
      x: this.rectWidth,
      y: this.rectWidth,
      label: `${this.label}-se`,
    }),
    new MyPoint({ x: 0, y: this.rectWidth, label: `${this.label}-sw` }),
  ];
  myLines = new Graphics();
  gridValue = 0;
  grid = new Graphics();
  constructor({
    text,
    x,
    y,
    ...args
  }: ContainerOptions & {
    text: string;
    x: number;
    y: number;
  }) {
    super(args);
    this.x = x * this.rectWidth;
    this.y = y * this.rectWidth;

    // this.textGrid.anchor = { x: 0.5, y: 0.5 };
    // this.textGrid.x = this.rectWidth / 2;
    // this.textGrid.y = this.rectWidth / 2;
    // this.textGrid.zIndex = 20;
    // this.textGrid.style = { fontSize: 12, fill: "yellow" };
    // this.textGrid.text = this.gridValue;
    // this.addChild(this.textGrid);

    this.grid.rect(0, 0, this.rectWidth, this.rectWidth);
    this.grid.stroke({ color: "white", width: 1 });
    this.addChild(this.grid);

    this.addChild(...this.points);

    this.addChild(this.myLines);
  }
  updateGridValue() {
    const x = this.points;
    const b = x.map((p) => (p.isOn ? "1" : 0)).join("");
    const int = parseInt(b, 2);
    // this.textGrid.text = JSON.stringify(b);
    this.gridValue = int;
    this.drawLine(int);
  }
  hidePoints() {
    for (let i = 0; i < this.points.length; i++) {
      this.points[i].visible = !this.points[i].visible;
    }
    this.grid.visible = !this.grid.visible;
  }
  drawLine(val: number) {
    const l = this.myLines;
    l.clear();
    l.zIndex = val;
    drawInterpolatedLine({
      l,
      int: val,
      squareWidth: this.rectWidth,
      nw: this.points[0].myValue,
      ne: this.points[1].myValue,
      se: this.points[2].myValue,
      sw: this.points[3].myValue,
    });
    // drawRect(val, l, this.rectWidth);
    l.stroke({ color: "purple", width: 2 });
  }
}

class Main {
  app = new Application();
  rects: Array<RectText> = [];
  circles: Array<Circle> = [];
  pointer: Circle = new Circle({ x: 400, y: 400, r: 50, label: "pointer" });
  elapsed: number = 0;
  stats = new statsx();
  height = 0;
  width = 0;
  cells = {
    width: Math.floor(window.innerWidth / RECT_WIDTH) / 1,
    height: Math.floor(window.innerHeight / RECT_WIDTH) / 1,
  };

  constructor() {
    this.init();
  }
  async init() {
    await this.app.init({ resizeTo: window });

    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);

    const canvas = this.app.canvas;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    document.body.appendChild(this.app.canvas);

    this.app.stage.eventMode = "static";
    this.app.stage.hitArea = this.app.screen;
    this.app.stage.on("mousemove", (e) => {
      this.pointer.x = e.x;
      this.pointer.y = e.y;
    });
    const myArray = generate2dArray({
      width: this.cells.width,
      height: this.cells.height,
    });
    myArray.forEach((val, i) =>
      val.forEach((_, j) => {
        const x = j;
        const y = i;
        const t = new RectText({
          label: `${i}-${j}`,
          text: "0",
          x,
          y,
        });
        this.rects.push(t);
      }),
    );
    this.width = this.cells.width * RECT_WIDTH;
    this.height = this.cells.height * RECT_WIDTH;

    this.circles.push(this.pointer);
    Array.from({ length: 4 }, () => {
      this.circles.push(
        new Circle({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
        }),
      );
    });
    this.app.stage.addChild(...this.circles);
    this.app.stage.addChild(...this.rects);
    for (let i = 0; i < this.rects.length; i++) {
      this.rects[i].hidePoints();
    }
    canvas.onclick = () => {
      for (let i = 0; i < this.circles.length; i++) {
        this.circles[i].visible = !this.circles[i].visible;
      }
    };
    this.app.ticker.add((ticker) => this.update(ticker));
  }

  update(ticker: Ticker) {
    this.stats.begin();
    this.elapsed += ticker.deltaTime;

    for (let i = 0; i < this.circles.length; i++) {
      const circle = this.circles[i];
      if (circle.label !== "pointer") {
        circle.x += circle.vx;
        circle.y += circle.vy;
        if (circle.x + circle.r > this.width) circle.vx = -Math.abs(circle.vx);
        else if (circle.x - circle.r < 0) circle.vx = Math.abs(circle.vx);
        if (circle.y + circle.r > this.height) circle.vy = -Math.abs(circle.vy);
        else if (circle.y - circle.r < 0) circle.vy = Math.abs(circle.vy);
      }
    }

    for (let i = 0; i < this.rects.length; i++) {
      const rect = this.rects[i];
      for (let j = 0; j < rect.points.length; j++) {
        const p = rect.points[j];
        let addedDistances = 0;
        const rx = rect.x + p.x;
        const ry = rect.y + p.y;

        for (let k = 0; k < this.circles.length; k++) {
          const circle = this.circles[k];
          const r2 = circle.r * circle.r;
          addedDistances += r2 / ((circle.y - ry) ** 2 + (circle.x - rx) ** 2);
        }

        p.setValue(addedDistances);
      }
      rect.updateGridValue();
    }

    this.stats.end();
  }
}

new Main();
