export const fromXYToIndex = (x: number, y: number, width: number) => {
  return y * width + x;
};

export const fromIndexToXY = (index: number, width: number, height: number) => {
  return [Math.floor(index / width), index % height];
};
