import Stats from "stats.js";
import { Pane } from "tweakpane";
import { Application, Ticker } from "pixi.js";
import { generate2dArray } from "./utils";
import { Circle } from "./circle";
import { RectText } from "./cell";

class Main {
  pane = new Pane();
  app = new Application();
  rects: Array<RectText> = [];
  circles: Array<Circle> = [];
  pointer: Circle = new Circle({
    x: 400,
    y: 400,
    r: 50,
    label: "pointer",
    circleVisible: false,
  });
  elapsed: number = 0;
  stats = new Stats();
  height = 0;
  width = 0;
  resolution = 50;
  isLoading = false;
  cells = {
    width: Math.floor(window.innerWidth / this.resolution),
    height: Math.floor(window.innerHeight / this.resolution),
  };
  PARAMS = {
    hidePoint: true,
    hideGrid: true,
    hideCircle: true,
    interpolate: true,
    resolution: this.resolution,
    xGrid: this.cells.width,
    yGrid: this.cells.height,
  };

  constructor() {
    this.init();
  }

  async init() {
    const el = document.getElementById("pixi-container");
    if (!el) throw new Error("No element to append");
    await this.app.init({ resizeTo: el });
    window.onresize = () => {
      this.app.resize();
      this.setupGrid({});
    };

    this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(this.stats.dom);

    const canvas = this.app.canvas;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    el.appendChild(this.app.canvas);

    this.app.stage.eventMode = "static";
    this.app.stage.hitArea = this.app.screen;

    this.app.stage.on("mousemove", (e) => {
      this.pointer.x = e.x;
      this.pointer.y = e.y;
    });
    this.app.stage.on("click", (e) => {
      this.addCircle({ x: e.x, y: e.y });
      console.log(this.circles, this.rects);
    });

    this.circles.push(this.pointer);
    this.setupPane();
    this.setupGrid({});
    Array.from({ length: 4 }, () => {
      this.circles.push(
        new Circle({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          circleVisible: false,
        }),
      );
    });
    this.app.stage.addChild(...this.circles);
    this.app.ticker.add((ticker) => this.update(ticker));
  }
  setupPane() {
    const { PARAMS } = this;
    this.pane
      .addButton({
        title: "add circle",
      })
      .on("click", () => {
        this.addCircle();
      });
    this.pane
      .addButton({
        title: "remove circle",
      })
      .on("click", () => {
        this.removeCircle();
      });
    this.pane.addBinding(PARAMS, "hidePoint").on("change", () => {
      for (let i = 0; i < this.rects.length; i++) {
        this.rects[i].togglePoints();
      }
    });
    this.pane.addBinding(PARAMS, "hideGrid").on("change", () => {
      for (let i = 0; i < this.rects.length; i++) {
        this.rects[i].toggleGrid();
      }
    });
    this.pane.addBinding(PARAMS, "hideCircle").on("change", () => {
      for (let i = 0; i < this.circles.length; i++) {
        this.circles[i].toggleCircle();
      }
    });
    this.pane.addBinding(PARAMS, "interpolate").on("change", () => {
      for (let i = 0; i < this.rects.length; i++) {
        this.rects[i].toggleInterpolate();
      }
    });
    this.pane
      .addBinding(PARAMS, "resolution", { min: 10, max: 200, step: 1 })
      .on("change", ({ value }) => {
        this.setupGrid({
          resolution: value,
          xGrid: Math.floor(window.innerWidth / value),
          yGrid: Math.floor(window.innerHeight / value),
        });
      });
  }

  setupGrid({
    xGrid,
    yGrid,
    resolution,
  }: {
    xGrid?: number;
    yGrid?: number;
    resolution?: number;
  }) {
    for (let i = 0; i < this.rects.length; i++) {
      this.rects[i].destroy({ children: true });
    }
    this.rects = [];
    this.resolution = resolution ?? this.resolution;
    this.cells = {
      width: xGrid ?? Math.floor(window.innerWidth / this.resolution),
      height: yGrid ?? Math.floor(window.innerHeight / this.resolution),
    };
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
          resolution: this.resolution,
          gridVisible: !this.PARAMS.hideGrid,
          pointVisible: !this.PARAMS.hidePoint,
          interpolate: this.PARAMS.interpolate,
        });
        this.rects.push(t);
      }),
    );
    this.app.stage.addChild(...this.rects);
    this.width = this.cells.width * this.resolution;
    this.height = this.cells.height * this.resolution;
  }

  addCircle(args?: { x: number; y: number }) {
    this.circles.push(
      new Circle({
        x: args?.x ?? Math.random() * this.width,
        y: args?.y ?? Math.random() * this.height,
        circleVisible: !this.PARAMS.hideCircle,
      }),
    );
    this.app.stage.addChild(this.circles[this.circles.length - 1]);
  }

  removeCircle() {
    if (this.circles.length > 1) {
      this.circles[this.circles.length - 1].destroy();
      this.circles.pop();
    }
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
      if (!rect?._position) break;
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
