/**
 * Draws an animated Node Garden effect.
 * using the ObjectsGrid collision detection class for faster neighbour lookup.
 *
 * @author Topaz Bar <topaz1008@gmail.com>
 */
import { ObjectsGrid } from './objectsgrid.js';
import { Particle } from './particle.js';

// CVars
const VIEW_WIDTH = 1280,
    VIEW_HEIGHT = 720,
    FPS = 30,
    NUM_PARTICLES = 250,
    SPRING_AMOUNT_MIN = 0.3,
    SPRING_AMOUNT_MAX = 1,
    MAX_SPEED = 1000,
    MIN_DISTANCE = 200;

// Globals
const canvas = document.getElementById('main'),
    context = canvas.getContext('2d'),
    objectsGrid = new ObjectsGrid(VIEW_WIDTH, VIEW_HEIGHT, MIN_DISTANCE),
    particles = [];

let lastTime = Date.now();

// Canvas size
canvas.width = VIEW_WIDTH;
canvas.height = VIEW_HEIGHT;

// Blending mode
context.globalCompositeOperation = 'screen';
context.lineWidth = 1;

canvas.addEventListener('click', (e) => {}, false);

// Init
addParticles(NUM_PARTICLES);
setInterval(update, 1000 / FPS);

/**
 * Add particles
 *
 * @param count {Number} Number of particles to add
 */
function addParticles(count) {
    for (let i = 0; i < count; i++) {
        const p = new Particle(getRandom(0, VIEW_WIDTH), getRandom(0, VIEW_HEIGHT), 2);
        p.vx = getRandom(-50, 50);
        p.vy = getRandom(-50, 50);

        particles.push(p);
    }
}

/**
 * Update loop
 */
function update() {
    const deltaTime = (Date.now() - lastTime) / 1000;
    context.clearRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

    //objectsGrid.drawGrid(context);
    objectsGrid.check(particles);
    const gridChecks = objectsGrid.checks.length;

    // For each pair of possible collisions
    for (let i = 0; i < gridChecks; i += 2) {
        const p0 = objectsGrid.checks[i];
        const p1 = objectsGrid.checks[i + 1];
        const dx = p1.x - p0.x;
        const dy = p1.y - p0.y;
        const distance = Math.sqrt((dx * dx) + (dy * dy));

        // Draw line ?
        if (distance < MIN_DISTANCE) {
            const lineAlpha = 1 - (distance / MIN_DISTANCE);
            if (lineAlpha > 0.2) {
                let r = (p0.y / VIEW_HEIGHT) * 255;
                let g = (p1.x / VIEW_WIDTH) * 255;
                let b = 4 * (p0.x + p1.y) / (VIEW_WIDTH + VIEW_HEIGHT) * 255;

                if (r < 100) r = 100;
                if (g < 100) g = 100;
                if (b < 100) b = 100;

                context.strokeStyle = makeRGBA(r, g, b, lineAlpha);
                context.beginPath();
                context.moveTo(p0.x, p0.y);
                context.lineTo(p1.x, p1.y);
                context.stroke();
            }

            // As the particles get closer to each other, they accelerate faster towards one another.
            const spring = getRandom(SPRING_AMOUNT_MIN, SPRING_AMOUNT_MAX);
            const ax = dx * spring * deltaTime * deltaTime;
            const ay = dy * spring * deltaTime * deltaTime;

            p0.vx += ax; p0.vy += ay;
            p1.vx -= ax; p1.vy -= ay;
        }
    }

    context.fillStyle = 'white';
    context.beginPath();
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.update(deltaTime, VIEW_WIDTH, VIEW_HEIGHT, false);
        p.draw(context);

        const speed = Math.sqrt((p.vx * p.vx) + (p.vy * p.vy));
        if (speed > MAX_SPEED) {
            p.vx /= speed; p.vy /= speed;
            p.vx *= MAX_SPEED; p.vy *= MAX_SPEED;
        }
    }

    context.closePath();
    context.fill();

    lastTime = Date.now();
}

/**
 * Make rgba color string from r,g,b (0-255) and a (0-1)
 *
 * @param r {Number}
 * @param g {Number}
 * @param b {Number}
 * @param a {Number}
 * @returns {String}
 */
function makeRGBA(r, g, b, a) {
    return 'rgba(' + (r | r) + ', ' + (g | g) + ', ' + (b | b) + ', ' + a + ')';
}

/**
 * Gets a random number between min and max
 *
 * @param min {Number}
 * @param max {Number}
 * @returns {Number}
 */
function getRandom(min, max) {
    return min + Math.random() * (max - min);
}
