export const getRandom = (min, max) => {
  var random = Math.random();
  return random * (max - min) + min;
}
