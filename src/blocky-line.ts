import { Graphics } from "pixi.js";

export function drawBlockyLine(int: number, l: Graphics, squareWidth: number) {
  const half = squareWidth / 2;

  switch (int) {
    case 0: // 0000
      break;
    case 1: // 0001
      l.moveTo(0, half);
      l.lineTo(half, squareWidth);
      l.lineTo(0, squareWidth);
      l.lineTo(0, half);
      break;
    case 2: // 0010
      l.moveTo(half, squareWidth);
      l.lineTo(squareWidth, half);
      l.lineTo(squareWidth, squareWidth);
      l.lineTo(half, squareWidth);

      break;
    case 3: // 0011
      l.moveTo(0, half);
      l.lineTo(squareWidth, half);
      l.lineTo(squareWidth, squareWidth);
      l.lineTo(0, squareWidth);
      l.lineTo(0, half);

      break;
    case 4: // 0100
      l.moveTo(half, 0);
      l.lineTo(squareWidth, half);
      l.lineTo(squareWidth, 0);
      l.lineTo(half, 0);

      break;
    case 5: // 0101
      l.moveTo(0, half);
      l.lineTo(half, squareWidth);
      l.lineTo(0, squareWidth);
      l.lineTo(0, half);
      l.moveTo(half, 0);
      l.lineTo(squareWidth, half);
      l.lineTo(squareWidth, 0);
      l.lineTo(half, 0);

      break;
    case 6: // 0110
      l.moveTo(half, 0);
      l.lineTo(squareWidth, 0);
      l.lineTo(squareWidth, squareWidth);
      l.lineTo(half, squareWidth);
      l.lineTo(half, 0);

      break;
    case 7: // 0111
      l.moveTo(0, half);
      l.lineTo(half, 0);
      l.lineTo(squareWidth, 0);
      l.lineTo(squareWidth, squareWidth);
      l.lineTo(0, squareWidth);
      l.lineTo(0, half);

      break;
    case 8: // 1000
      l.moveTo(0, 0);
      l.lineTo(half, 0);
      l.lineTo(0, half);
      l.lineTo(0, 0);

      break;
    case 9: // 1001
      l.moveTo(0, 0);
      l.lineTo(half, 0);
      l.lineTo(half, squareWidth);
      l.lineTo(0, squareWidth);
      l.lineTo(0, 0);

      break;
    case 10: // 1010
      l.moveTo(0, 0);
      l.lineTo(half, 0);
      l.lineTo(squareWidth, half);
      l.lineTo(squareWidth, squareWidth);
      l.lineTo(half, squareWidth);
      l.lineTo(0, half);
      l.lineTo(0, 0);

      break;
    case 11: // 1011
      l.moveTo(0, 0);
      l.lineTo(half, 0);
      l.lineTo(squareWidth, half);
      l.lineTo(squareWidth, squareWidth);
      l.lineTo(0, squareWidth);
      l.lineTo(0, 0);

      break;
    case 12: // 1100
      l.moveTo(0, 0);
      l.lineTo(squareWidth, 0);
      l.lineTo(squareWidth, half);
      l.lineTo(0, half);
      l.lineTo(0, 0);

      break;
    case 13: // 1101
      l.moveTo(0, 0);
      l.lineTo(squareWidth, 0);
      l.lineTo(squareWidth, half);
      l.lineTo(half, squareWidth);
      l.lineTo(0, squareWidth);
      l.lineTo(0, 0);

      break;
    case 14: // 1110
      l.moveTo(0, 0);
      l.lineTo(squareWidth, 0);
      l.lineTo(squareWidth, squareWidth);
      l.lineTo(half, squareWidth);
      l.lineTo(0, half);
      l.lineTo(0, 0);

      break;
    case 15: // 1111
      l.moveTo(0, 0);
      l.lineTo(squareWidth, 0);
      l.lineTo(squareWidth, squareWidth);
      l.lineTo(0, squareWidth);
      l.lineTo(0, 0);

      break;
  }
}
