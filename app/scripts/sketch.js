/* jshint newcap: false */

'use strict';

import $ from 'jquery';
import _ from 'lodash';
import p5 from 'p5';
import Particle from './Particle';
import { getRandomFloat, getRandomInt } from './util';

let config = { 
  parent: '.canvas-wrapper',
  //bgcolor: [186/360, 0.84, 0.39].map(x => Math.floor(x*255)),
  //color: [10/360, 0.73, 0.74].map(x => Math.floor(x*255)),
};

let $canvasWrapper = $(config.parent);
let particles = [];
window.particles = particles;

function sketch(s) {

  s.setup = function() {

    s.createCanvas(
      $canvasWrapper.innerWidth(),
      $canvasWrapper.innerHeight()
    ).parent($canvasWrapper[0]);

    s.background(0);
    s.stroke(200);

    particles.push(new Particle({
      sketch: s,
      velocity: new p5.Vector(1,1),
      acceleration: new p5.Vector(0.5,0.5),
    }));
  };

  s.draw = function() {

    _.forEach(particles, (p) => {
      p.update().render();
    });

  };

  s.mousePressed = function() {

    let p = new Particle({
      position: new p5.Vector(s.mouseX, s.mouseY),
      sketch: s,
      velocity: new p5.Vector( getRandomFloat(-1,1), getRandomFloat(-1,1) ),
      acceleration: new p5.Vector(0,0),
      color: [getRandomInt(0,255), getRandomInt(0,255), getRandomInt(0,255)]
    });
    particles.push(p);

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