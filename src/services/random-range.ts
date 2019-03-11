export const randomRange = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const randomIntRange = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
