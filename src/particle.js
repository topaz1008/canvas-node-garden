/**
 * A simple particle class.
 *
 * @author Topaz Bar <topaz1008@gmail.com>
 */
const TWO_PI = 2 * Math.PI;

export class Particle {
    x;
    y;
    vx = 0;
    vy = 0;
    r;

    /**
     * Creates a new particle.
     *
     * @param x {Number} The x position
     * @param y {Number} The y position
     * @param r {Number} The radius
     * @constructor
     */
    constructor(x, y, r) {
        this.x = x;
        this.y = y;
        this.r = r;
    }

    /**
     * Draw the particle by drawing a circle with radius r.
     * Assumes context.beginPath() was already called.
     * And that context.fill()/stroke() is called after this function.
     *
     * @param context {CanvasRenderingContext2D} A valid canvas rendering context
     */
    draw(context) {
        context.arc(this.x, this.y, this.r, 0, TWO_PI);
        context.closePath();
    }

    /**
     * Update the particle's position and velocity.
     * Also sets the boundary conditions for bouncing off or wrapping around boundaries.
     *
     * @param deltaTime {Number} The time-step for velocity integration
     * @param viewWidth {Number} The view width to bound too
     * @param viewHeight {Number} The view height to bound too
     * @param [wrap] {Boolean} Wrap or bound around boundaries
     * @optional
     */
    update(deltaTime, viewWidth, viewHeight, wrap) {
        if (wrap === false) {
            // Bounce off boundaries
            if (this.x > viewWidth - this.r) {
                this.x = viewWidth - this.r;
                this.vx *= -1;

            } else if (this.x < this.r) {
                this.x = this.r;
                this.vx *= -1;
            }

            if (this.y > viewHeight - this.r) {
                this.y = viewHeight - this.r;
                this.vy *= -1;

            } else if (this.y < this.r) {
                this.y = this.r;
                this.vy *= -1;
            }
        } else {
            // Wrap around boundaries
            if (this.x > viewWidth) {
                this.x = 0;
            } else if (this.x < 0) {
                this.x = viewWidth;
            }

            if (this.y > viewHeight) {
                this.y = 0;
            } else if (this.y < 0) {
                this.y = viewHeight;
            }
        }

        // Integrate velocity
        this.x += this.vx * deltaTime;
        this.y += this.vy * deltaTime;
    }
}
