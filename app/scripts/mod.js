/**
* mod.js
* a better modulo. Handles negatives correctly.
*/

'use strict';

export default function mod(n,m) {
  return ((n%m)+m)%m;
}