
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
      // small amount of energy loss on edge bounce
      edgeBounceFactor: 0.99,
      edgeBounceMode: false,
      edgeWrapMode: true,
      frictionFactor: 1,
      maxVelocity: 100,
      position:  new p5.Vector(0,0),
      sketch: null,
      velocity: new p5.Vector(0,0),
      color: [127],
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

  /**
  * checks is two particles are equal
  * two particles are equal if they have the same
  * position, velocity, and accel
  */
  equals(anotherParticle) {
    
    let samePos = this.position.equals(anotherParticle.position);

    let sameVel = this.velocity.equals(anotherParticle.velocity);

    let sameAccel = this.acceleration.equals(anotherParticle.acceleration);

    return samePos && sameVel && sameAccel; 
  }

  /**
  * toString()
  */
  toString() {
    let obj = {
      position: this.position,
      velocity: this.velocity,
      acceleration: this.acceleration,
    };

    return obj.toString();
  }

  /*
  * returns a vector from this particle's position
  * to another particle's position
  */
  getVectorTo(anotherParticle) {
    return anotherParticle.position
      .copy()
      .sub(this.position);
  }

  /**
  * returns the distance^2 (magnitude) between
  * this particle and another particle
  *
  * this function may be more useful in particle systems
  * since we avoid finding the distance (which involves
  * a sqrt) and then squaring it again.
  */
  getDistSqTo(anotherParticle) {
    let dx = this.position.x - anotherParticle.position.x;
    let dy = this.position.y - anotherParticle.position.y;

    let distSq = dx*dx + dy*dy;
    return distSq;
  }

  getDistTo(anotherParticle) {
    if ( !(anotherParticle instanceof Particle) ) {
      throw Error(`getDistanceTo(): cannot get distance between ${this} and other particle '${anotherParticle}'`);
    }

    return this.position.dist(anotherParticle.position);
  }

  /**
  * _correctForEdgeWrap
  */
  _correctForEdgeWrap() {

    // off right edge, wrap around to left
    if (this.position.x > this.sketch.width) {
      this.position.x = 0;
      this.previousPosition.x = this.position.x - this.velocity.x;
    }

    // off left edge 
    if (this.position.x < 0) {
      this.position.x = this.sketch.width;
      this.previousPosition.x = this.position.x - this.velocity.x;
    }

    // off top edge
    if (this.position.y < 0) {
      this.position.y = this.sketch.height;
      this.previousPosition.y = this.position.y - this.velocity.y;
    }

    // off bottom edge
    if (this.position.y > this.sketch.height) {
      this.position.y = 0;
      this.previousPosition.y = this.position.y - this.velocity.y;
    }
  }

  /**
  * if this particle's current position is beyond the edge
  * of the canvas, change the position so that it
  * appears to have "bounced" off the edge
  */
  _correctForEdgeBounce() {
    
    // position off right edge
    if (this.position.x > this.sketch.width) {
      this.position.x = this.sketch.width;
      this.previousPosition.x = this.position.x + this.velocity.x * this.edgeBounceFactor;
    }

    // left edge
    if (this.position.x < 0) {
      this.position.x = 0;
      this.previousPosition.x = this.position.x + this.velocity.x * this.edgeBounceFactor;
    }

    // bottom edge
    if (this.position.y > this.sketch.height) {
      this.position.y = this.sketch.height;
      this.previousPosition.y = this.position.y + this.velocity.y * this.edgeBounceFactor;
    }

    // top edge
    if (this.position.y < 0) {
      this.position.y = 0;
      this.previousPosition.y = this.position.y + this.velocity.y * this.edgeBounceFactor;
    }

  }


  /**
  * update position using Verlet Integration
  */
  update() {

    // calulate new velocity
    // note we use previousPosition and position to calc current velocity
    this.velocity.set(
      ( this.position.x - this.previousPosition.x + this.acceleration.x ) * this.frictionFactor,
      ( this.position.y - this.previousPosition.y + this.acceleration.y ) * this.frictionFactor
    );

    // keep the velocity within the bounds of maxVelocity
    this.velocity.limit(this.maxVelocity);

    // update previousPosition
    this.previousPosition.set(this.position.copy());

    // update current position, taking the above calculated velocity into account
    this.position.add(this.velocity);

    // correct if bounce
    if (this.edgeBounceMode) {
      this._correctForEdgeBounce();
    } else if (this.edgeWrapMode) {
      this._correctForEdgeWrap();
    }

    return this;
  }

  render() {
    let s = this.sketch;

    if (!s) {
      throw new Error('Cannot render. No sketch is set for this particle.');
    }

    s.push();
    //s.stroke(this.color);
    //s.point(this.position.x, this.position.y);
    s.noStroke();
    s.fill(this.color);
    s.ellipse(this.position.x, this.position.y, 10, 10);
    s.pop();

    return this;
  }

}