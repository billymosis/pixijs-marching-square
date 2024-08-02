export function lerp(start: number, end: number, t: number): number {
  return start + t * (end - start);
}

export const lerp2 = (
  x0: number,
  x1: number,
  y0: number,
  y1: number,
  x: number,
) => {
  return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
};

export const generate2dArray = ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  const gridValues = Array.from({ length: height }, () =>
    new Array(width).fill(0),
  );

  return gridValues;
};
