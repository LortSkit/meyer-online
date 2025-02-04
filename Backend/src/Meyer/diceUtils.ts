//From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random

function _getRandomInt(min: number, max: number) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

export function getDiceRoll(): number {
  return _getRandomInt(1, 7);
}

function _getRoll(): [number, number] {
  return [getDiceRoll(), getDiceRoll()];
}

function _determineRoll(roll: [number, number]): number {
  if (roll[0] > roll[1]) {
    return roll[0] * 10 + roll[1];
  } else {
    return roll[1] * 10 + roll[0];
  }
}

export function getMeyerRoll() {
  return _determineRoll(_getRoll());
}
