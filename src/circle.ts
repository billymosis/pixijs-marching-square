import { Graphics, Container, ContainerOptions } from "pixi.js";

export class Circle extends Container {
  r = 50 + Math.floor(Math.random() * 100);
  r2 = this.r ** 2;
  vx = 2 * Math.random() - 1;
  vy = 2 * Math.random() - 1;
  constructor(
    args?: ContainerOptions & { r?: number; circleVisible: boolean },
  ) {
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
    this.visible = args?.circleVisible ?? false;
    this.addChild(c);
  }

  toggleCircle() {
    this.visible = !this.visible;
  }
}
