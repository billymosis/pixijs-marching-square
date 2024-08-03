import { Graphics, Container, GraphicsOptions } from "pixi.js";

export class MyPoint extends Container {
  myValue = 0;
  isOn = false;
  circle: Graphics | null = null;
  constructor(args: GraphicsOptions & { render?: boolean }) {
    super(args);
    if (args.render) {
      this.circle = new Graphics();
      this.circle.circle(0, 0, 5);
      this.addChild(this.circle);
    }
  }
  setValue(n: number) {
    this.myValue = n;
    if (this.myValue > 1) {
      this.isOn = true;
      if (!this.circle?.visible) return;
      this.circle.clear().circle(0, 0, 5).fill({ color: "red" });
    } else {
      this.isOn = false;
      if (!this.circle?.visible) return;
      this.circle.clear().circle(0, 0, 5).fill({ color: "blue" });
    }
  }
}
