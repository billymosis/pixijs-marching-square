import { Graphics } from "pixi.js";
import { lerp, lerp2 } from "./utils";

type Params = {
  l: Graphics;
  int: number;
  squareWidth: number;
  nw: number;
  ne: number;
  se: number;
  sw: number;
};

export function drawInterpolatedLine({
  int,
  l,
  squareWidth: _squareWidth,
  nw,
  ne,
  se,
  sw,
}: Params) {
  let squareWidth = _squareWidth;
  const a = linearInterpolation(nw, ne, 0, squareWidth, 1);
  const b = linearInterpolation(ne, se, 0, squareWidth, 1);
  const c = linearInterpolation(sw, se, 0, squareWidth, 1);
  const d = linearInterpolation(nw, sw, 0, squareWidth, 1);

  switch (int) {
    case 0: // 0000
    case 15: // 1111
      // Do nothing or potentially draw a full square
      break;
    case 14: // 1110
    case 1: // 0001
      l.moveTo(c, squareWidth);
      l.lineTo(0, d);
      break;
    case 13: // 1101
    case 2: // 0010
      l.moveTo(squareWidth, b);
      l.lineTo(c, squareWidth);
      break;
    case 12: // 1100
    case 3: // 0011
      l.moveTo(squareWidth, b);
      l.lineTo(0, d);
      break;
    case 11: // 1011
    case 4: // 0100
      l.moveTo(a, 0);
      l.lineTo(squareWidth, b);
      break;
    case 5: // 0101
      l.moveTo(0, d);
      l.lineTo(d, 0);
      l.moveTo(squareWidth, b);
      l.lineTo(c, squareWidth);
      break;
    case 9: // 1001
    case 6: // 0110
      l.moveTo(a, 0);
      l.lineTo(c, squareWidth);
      break;
    case 7: // 0111
    case 8: // 1000
      l.moveTo(a, 0);
      l.lineTo(0, d);
      break;
    case 10: // 1010
      l.moveTo(a, 0);
      l.lineTo(squareWidth, b);
      l.moveTo(c, squareWidth);
      l.lineTo(0, d);
      break;
    default:
      console.warn(`Unexpected int value: ${int}`);
  }
}

export const linearInterpolation = (
  x0: number,
  x1: number,
  y0: number,
  y1: number,
  x: number,
) => {
  if (x0 === x1) {
    return 0;
  }
  return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
};
