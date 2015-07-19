
'use strict';

import _ from 'lodash';
import p5 from 'p5';
import Particle from './Particle';

/**
* A Gravitational Particle System
*/
export default class ParticleSystem {

  /**
  * constructor
  */
  constructor(config) {
    let defaults = {
      gravitationalConstant: 5 * Math.pow(10,3),
      maxAccel: 1,
      particles: [],
      sketch: null,
    };

    config = _.assign({}, defaults, config);

    if (! config.sketch) {
      throw new Error(`Particle System has no p5 sketch set.`);
    }

    Object.keys(config).forEach((key) => {
      this[key] = config[key];
    });

  }

  /**
  * removes all particles within the system
  */
  removeAll() {
    this.particles = [];
  }

  add(config) {
    let defaults = {
      position: new p5.Vector(0,0),
      velocity: new p5.Vector(0,0),
      acceleration: new p5.Vector(0,0),
      color: [127],
      sketch: this.sketch,
    };

    config = _.assign({}, defaults, config);

    // create a new particle and add it to
    // our particles list
    this.particles.push(new Particle(config));
  }

  _applyForcesTo(particleFeelingForce) {

    // reset acceleration due to gravitation force to 0
    particleFeelingForce.acceleration.set(0,0);

    _.forEach(this.particles, (p) => {

      // don't apply force from self to self, silly
      if (p === particleFeelingForce) {
        return;
      }

      // get distance between particleFeelingForce and p
      // TODO: incorporate mass.
      let distSq = particleFeelingForce.getDistSqTo(p);

      // direction of accel vector
      // normalized (unit length is 1)
      let rVector = particleFeelingForce.getVectorTo(p).normalize();

      // accel due to gravity (magnitude)
      // TODO: incorporate mass.
      let gAccel = this.gravitationalConstant/distSq;

      // limit the maximum accel
      gAccel = Math.min(gAccel, this.maxAccel);

      // multiply our rVector by acceleration due to gravity, to create the gravitational acceleration
      // vector
      let gVector = rVector.mult(gAccel);

      // add this new acceleration
      particleFeelingForce.acceleration.add(gVector);

    });
  }

  update() {

    // update acceleration
    // we do this separately from updating position
    // since particle positions affect acceleration
    // (with the inverse sq of distance)
    _.forEach(this.particles, (p) => {
      this._applyForcesTo(p);
    });

    return this;
  }

  // TODO: combine update and render so that there's only
  // one loop. Probably better for performance, but
  // is there a tradeoff? Keeping separate for now.
  render() {
    _.forEach(this.particles, (p) => {
      p.update().render();
    });
  }

}