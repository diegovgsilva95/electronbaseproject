"use strict";

/** @param {Coordinates} a @param {Coordinates} b */
const dist = (a,b)=>Math.sqrt(((a.x - b.x) ** 2) + ((a.y - b.y) ** 2));
const CONNECTION_THRESHOLD = 0.3;
class Particle {
    constructor(x,y,vx,vy){
        this.pos = {
            x: typeof x !== "undefined" ? x : Math.random(),
            y: typeof y !== "undefined" ? y : Math.random()
        };
        this.vel = {
            x: typeof vx !== "undefined" ? vx : ((Math.random() - 0.5) / 100),
            y: typeof vy !== "undefined" ? vy : ((Math.random() - 0.5) / 100)
        };
        /** @type {{particle: Particle, distance: number}[]} */
        this.connections = [];
    }
    update(){
        let outOfBounds = false;
        ["x", "y"].forEach(axis=>{
            this.pos[axis] = this.pos[axis] + this.vel[axis];
            if(outOfBounds || this.pos[axis] < 0 || this.pos[axis] > 1)
                outOfBounds = true;
            
            this.vel[axis] += (Math.random() - 0.5) / 1000;
        });
        return !outOfBounds;
    }

    /** @param {Particle[]} particles */
    findConnections(particles){

        this.connections.splice(0);

        particles.forEach(particle=>{
            
            if(particle === this)// || (this.pos.x - particle.pos.x < Number.EPSILON) || (this.pos.y - particle.pos.y < Number.EPSILON)) 
                return;

            let distance = dist(particle.pos, this.pos);
            if(distance < CONNECTION_THRESHOLD){
                this.connections.push({distance: distance / CONNECTION_THRESHOLD, particle});

                let diff = {x:0,y:0};
                [diff.x, diff.y] = ["x","y"].map(axis=>this.pos[axis] - particle.pos[axis]);

                particle.vel.x += Math.sign(diff.x) * Math.sqrt(0.005 * Math.abs(diff.x) / CONNECTION_THRESHOLD) / 50000;
                particle.vel.y += Math.sign(diff.y) * Math.sqrt(0.005 * Math.abs(diff.y) / CONNECTION_THRESHOLD) / 50000;
                
            }
        });
    }
}


module.exports = Particle;


/** @typedef {Object} Coordinates 
 * @prop {number} x
 * @prop {number} y
 * 
*/