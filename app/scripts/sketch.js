/* jshint newcap: false */

'use strict';

import $ from 'jquery';
import p5 from 'p5';


let config = { 
  parent: '.canvas-wrapper',
  //bgcolor: [186/360, 0.84, 0.39].map(x => Math.floor(x*255)),
  //color: [10/360, 0.73, 0.74].map(x => Math.floor(x*255)),
};

let $canvasWrapper = $(config.parent);

function sketch(s) {

  s.setup = function() {

    s.createCanvas(
      $canvasWrapper.innerWidth(),
      $canvasWrapper.innerHeight()
    ).parent($canvasWrapper[0]);
  };

  s.draw = function() {};

  s.mousePressed = function() {
  };

  s.windowResized = function() {
    s.resizeCanvas( $canvasWrapper.innerWidth(), $canvasWrapper.innerHeight() );
    s.setup();
  };

}

function init() {
  return new p5(sketch);
}

module.exports = { init };