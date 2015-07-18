
'use strict';

import p5 from 'p5';
import _ from 'lodash';

/**
* p5 Particle
*/
export default class Particle {

  /**
  * constructor()
  */
  constructor(config) {

    let defaults = {
      acceleration: new p5.Vector(0,0),
      position:  new p5.Vector(0,0),
      sketch: null,
      velocity: new p5.Vector(0,0),
    };

    config = _.assign({}, defaults, config);

    Object.keys(config).forEach((key) => {
      this[key] = config[key];
    });

    // for verlet integration we need to keep track of the old position
    // We calculate where the particle would have been in the past
    this.previousPosition = new p5.Vector(
      this.position.x - this.velocity.x,
      this.position.y - this.velocity.y
    );


  }

  getDistanceTo(anotherParticle) {
    if ( !(anotherParticle instanceof Particle) ) {
      throw Error(`getDistanceTo(): cannot get distance between ${this} and other particle '${anotherParticle}'`);
    }

    return this.position.dist(anotherParticle.position);
  }

  // setAcceleration(accelVector) {}
  // setVelocity(velocityVector) {}
  // setPosition(positionVector) {}

  /**
  * update position using Verlet Integration
  */
  update() {

    // calulate new velocity
    // note we use previousPosition and position to calc current velocity
    this.velocity.set(
      this.position.x - this.previousPosition.x + this.acceleration.x,
      this.position.y - this.previousPosition.y + this.acceleration.y
    );

    // update previousPosition
    this.previousPosition.set( this.position.x, this.position.y);

    // update current position, taking the above calculated velocity into account
    this.position.add(this.velocity.x, this.velocity.y);

    return this;
  }

  render() {
    let s = this.sketch;

    if (!s) {
      throw new Error('Cannot render. No sketch is set for this particle.');
    }

    s.point(this.position.x, this.position.y);

    return this;
  }

}