"use strict";

const
    Particle = require("./js/particle"),
    less = require("less/dist/less.min"),
    jQuery = require("jquery");

const $ = jQuery;


/** @type {JQuery<HTMLCanvasElement>} */
let canvas;

/** @type {Particle[]} @global */
let particles;

/** @type {{x:number,y:number}[]} */
let clicked;


/** @param {JQuery<HTMLCanvasElement>} canvas */
const updateSize = function(){
    canvas.attr("width", canvas.width());
    canvas.attr("height", canvas.height());
};

/** @param {CanvasRenderingContext2D} dc */
const draw = function(dc){
    let w = canvas.width();
    let h = canvas.height();
    let mx = Math.max(w,h);
    let mn = Math.min(w,h);

    dc.clearRect(0,0,w,h);
    dc.fillStyle = "#9ee9f8";

    particles.forEach(particle => {
        particle.findConnections(particles);
        particle.connections.forEach(connection=>{
            let strength = 1-connection.distance;
            dc.strokeStyle = `rgba(158, 233, 248, ${strength.toFixed(2)})`;
            dc.lineWidth = strength * mn / 300;
            dc.beginPath();
            dc.moveTo(particle.pos.x * w, particle.pos.y * h);
            dc.lineTo(connection.particle.pos.x * w, connection.particle.pos.y * h);
            dc.stroke();
        });
    });


    particles.forEach(particle=>{
        dc.beginPath();
        dc.arc(particle.pos.x * w, particle.pos.y * h, mn/200, 0, 2 * Math.PI);
        dc.fill();

    });

    let _particles = [];

    particles.forEach(particle => {
        if(particle.update())
            _particles.push(particle);
    })

    clicked.forEach(pos=>{
        _particles.push(new Particle(pos.x, pos.y, 0,0));
    });
    clicked.splice(0);

    if(_particles.length < 30)
        Array(Math.floor(Math.random() * 5)).fill(0).forEach(_=>{
            _particles.push(new Particle());
        });

    particles.splice(0);
    _particles.forEach(particle=>particles.push(particle));

    requestAnimationFrame(draw.bind(this, dc)) 
}
const initParticles = function(){
    particles = Array(5).fill(0).map(_=>new Particle());
    window.particles = window.particles || particles;
}

const readiness = function(){
    canvas = $("canvas")
    updateSize(canvas);
    initParticles();
    $(window).resize(updateSize);
    let dc = canvas.get(0).getContext("2d");

    clicked = [];

    $(document.body).on("mousedown mouseup", function(ev){
        console.log(ev);
        clicked.push({
            x: ev.pageX / canvas.width(), 
            y: ev.pageY / canvas.height()
        });
    });
    requestAnimationFrame(draw.bind(this, dc)) 
};


const main = function(){
    less.watch();
    $(document).ready(readiness);
};


main();