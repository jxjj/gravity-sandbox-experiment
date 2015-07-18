'use strict';

/**
* Returns a random integer between min (included)
* and max (excluded). Using Math.round() will
* give you a non-uniform distribution!
*
* source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
**/
export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

export function getRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}
