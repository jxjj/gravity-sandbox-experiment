/* jshint newcap: false */

'use strict';

import $ from 'jquery';
//import _ from 'lodash';
import p5 from 'p5';
import ParticleSystem from './ParticleSystem';
import { getRandomInt } from './util';

let Vector = p5.Vector;

let config = { 
  parent: '.canvas-wrapper',
  //bgcolor: [186/360, 0.84, 0.39].map(x => Math.floor(x*255)),
  //color: [10/360, 0.73, 0.74].map(x => Math.floor(x*255)),
};

let $canvasWrapper = $(config.parent);
let particleSys;

function sketch(s) {

  s.setup = function() {

    s.createCanvas(
      $canvasWrapper.innerWidth(),
      $canvasWrapper.innerHeight()
    ).parent($canvasWrapper[0]);

    s.background(0);
    s.stroke(200);
    //s.frameRate(1);

    particleSys = new ParticleSystem({
      sketch: s,
    });

    particleSys.add( {
      position: new Vector(s.width/2 - 100, s.height/2),
      color: 'red',
    });

    particleSys.add( {
      position: new Vector(s.width/2 + 100, s.height/2),
      color: 'blue',
    });
  };

  s.draw = function() {
    s.background(0);
    particleSys.update().render();

  };

  s.mousePressed = function() {

    particleSys.add({
      position: new p5.Vector(s.mouseX, s.mouseY),
      color: [getRandomInt(0,255), getRandomInt(0,255), getRandomInt(0,255)]
    });
  };

  s.windowResized = function() {
    s.resizeCanvas( $canvasWrapper.innerWidth(), $canvasWrapper.innerHeight() );
    s.setup();
  };

}

function init() {
  return new p5(sketch);
}

export default { init };