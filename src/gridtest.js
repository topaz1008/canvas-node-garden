/**
 * Demo app for testing the ObjectsGrid collision detection class.
 *
 * @author Topaz Bar <topaz1008@gmail.com>
 */
import { ObjectsGrid } from './objectsgrid.js';
import { Particle } from './particle.js';

const VIEW_WIDTH = 1024,
    VIEW_HEIGHT = 768,
    MIN_DISTANCE = 20;

const canvas = document.getElementById('main-canvas'),
    context = canvas.getContext('2d'),
    balls = [],
    objectsGrid = new ObjectsGrid(VIEW_WIDTH, VIEW_HEIGHT, MIN_DISTANCE);

let numberOfBalls = 0,
    numberOfChecks = 0,
    useGrid = true;

canvas.width = VIEW_WIDTH;
canvas.height = VIEW_HEIGHT;
context.font = 'bold 20px Arial';

document.getElementById('btn-toggle')
    .addEventListener('click', (e) => {
    e.preventDefault();

    useGrid = !useGrid;
    if (useGrid) {
        e.currentTarget.innerHTML = 'Grid based';
    } else {
        e.currentTarget.innerHTML = 'Trivial';
    }

}, false);

document.getElementById('btn-add-balls')
    .addEventListener('click', (e) => {
    e.preventDefault();

    addBalls(100);

}, false);

addBalls(1000);
update();

function addBalls(count) {
    for (let i = 0; i < count; i++) {
        const radius = getRandom(5, 10);
        const ball = new Particle(getRandom(10, VIEW_WIDTH), getRandom(10, VIEW_HEIGHT), radius);
        ball.vx = getRandom(-0.25, 0.25);
        ball.vy = getRandom(-0.25, 0.25);

        balls.push(ball);
    }

    numberOfBalls += count;
}

function checkCollision(ball0, ball1) {
    ++numberOfChecks;
    let dx = ball1.x - ball0.x,
        dy = ball1.y - ball0.y,
        dist = Math.sqrt((dx * dx) + (dy * dy)),
        minDist = (ball0.r + ball1.r);

    if (dist < minDist) {
        if (ball0.color !== 'red') ball0.color = 'red';
        if (ball1.color !== 'red') ball1.color = 'red';
    }
}

function update() {
    context.clearRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

    objectsGrid.drawGrid(context, 'black');
    const lastTime = Date.now();
    if (useGrid) {
        objectsGrid.check(balls);
        let gridChecks = objectsGrid.checks.length;
        for (let i = 0; i < gridChecks; i += 2) {
            checkCollision(objectsGrid.checks[i], objectsGrid.checks[i + 1]);
        }

    } else {
        basicCheck();
    }

    const detectionTime = (Date.now() - lastTime);
    for (let i = 0; i < balls.length; i++) {
        context.fillStyle = balls[i].color;
        context.beginPath();
        balls[i].draw(context);
        context.fill();

        balls[i].update(1, VIEW_WIDTH, VIEW_HEIGHT, false);

        // Reset the color
        if (balls[i].color !== 'black') balls[i].color = 'black';
    }

    context.fillStyle = 'rgb(255, 255, 255)';
    const info = `Number of balls: ${numberOfBalls} | Number of checks: ${numberOfChecks} | Detection Time: ${detectionTime}ms`;
    context.fillText(info, 5, 25);
    numberOfChecks = 0;

    requestAnimationFrame(update);
}

function getRandom(min, max) {
    return min + Math.random() * (max - min);
}

function basicCheck() {
    // Trivial collision detection algorithm
    // Just check all possible pairs
    // complexity O((n^2 - n)/2)
    const length = balls.length;
    for (let i = 0; i < (length - 1); ++i) {
        const ball0 = balls[i];
        for (let j = (i + 1); j < length; ++j) {
            const ball1 = balls[j];
            checkCollision(ball0, ball1);
        }
    }
}
