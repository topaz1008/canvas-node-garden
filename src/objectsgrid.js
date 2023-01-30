/**
 * A uniform grid class for doing faster collision detection between many objects.
 *
 * Based on an algorithm presented in "AdvancED ActionScript Animation" by Keith Peters
 *
 * @author Topaz Bar <topaz1008@gmail.com>
 */
export class ObjectsGrid {
    checks = [];
    grid = [];
    blockSize;
    width;
    height;
    numOfColumns;
    numOfRows;
    numOfCells;

    /**
     * @param width {Number}
     * @param height {Number}
     * @param blockSize {Number}
     * @constructor
     */
    constructor(width, height, blockSize) {
        this.blockSize = blockSize;
        this.width = width;
        this.height = height;
        this.numOfColumns = Math.ceil(width / blockSize);
        this.numOfRows = Math.ceil(height / blockSize);
        this.numOfCells = this.numOfColumns * this.numOfRows;
    }

    /**
     * Draw the grid on the context.
     *
     * @param context {CanvasRenderingContext2D}
     * @param [color] {String}
     * @public
     */
    drawGrid(context, color) {
        context.lineWidth = 1;
        context.strokeStyle = color || 'gray';
        context.beginPath();
        for (let i = 0; i <= this.width; i += this.blockSize) {
            context.moveTo(i, 0);
            context.lineTo(i, this.height);
        }

        for (let i = 0; i <= this.height; i += this.blockSize) {
            context.moveTo(0, i);
            context.lineTo(this.width, i);
        }

        context.stroke();
    }

    /**
     * Check the objects passed for possible collision pairs.
     * The pairs are saved in the 'checks' array.
     *
     * @param objects {Array}
     * @public
     */
    check(objects) {
        this.grid = new Array(this.numOfCells);
        this.checks = [];

        for (let i = 0; i < objects.length; ++i) {
            const obj = objects[i];

            // Index (y * numCols + x)
            const fX = obj.x / this.blockSize;
            const fY = obj.y / this.blockSize;
            let index = (fY | fY) * this.numOfColumns + (fX | fX);

            if (index < 0) {
                index = 0;
            } else if (index >= this.grid.length) {
                index = (this.grid.length - 1);
            }

            // Only create a new cell here if we need too
            if (!this.grid[index]) {
                this.grid[index] = [];
            }

            // Assign object to cell
            this.grid[index].push(obj);
        }

        // Loop through each cell of the grid
        // We actually only check the current cell against the lower right triangle (almost)
        // of cells below and to the right. While making sure we do not overflow the bounds.
        //
        // |_|_|_|_|
        // |_|x|.|_| -> x is the current cell
        // |.|.|.|_| -> . are the cells being checked for possible collisions
        // |_|_|_|_|
        for (let i = 0; i < this.numOfColumns; ++i) {
            for (let j = 0; j < this.numOfRows; ++j) {
                this.#checkOneCell(i, j);
                this.#checkTwoCells(i, j, i + 1, j);     // The cell to the right
                this.#checkTwoCells(i, j, i - 1, j + 1); // The cell below to the left
                this.#checkTwoCells(i, j, i, j + 1);     // The cell directly below
                this.#checkTwoCells(i, j, i + 1, j + 1); // The cell below to the right
            }
        }
    }

    /**
     * Check one cell.
     *
     * @param x {Number}
     * @param y {Number}
     * @private
     */
    #checkOneCell(x, y) {
        // Get cell
        let index = y * this.numOfColumns + x,
            cell = this.grid[index];
        if (!cell) return;

        // Mark all pairs
        let length = cell.length;
        for (let i = 0; i < (length - 1); ++i) {
            const obj0 = cell[i];
            for (let j = (i + 1); j < length; ++j) {
                const obj1 = cell[j];
                this.checks.push(obj0, obj1);
            }
        }
    }

    /**
     * Check two cells.
     *
     * @param x0 {Number}
     * @param y0 {Number}
     * @param x1 {Number}
     * @param y1 {Number}
     * @private
     */
    #checkTwoCells(x0, y0, x1, y1) {
        // Make sure we're in bounds
        if (x1 < 0 || x1 >= this.numOfColumns || y1 < 0 || y1 >= this.numOfRows) return;

        // Get cells
        let index0 = y0 * this.numOfColumns + x0,
            index1 =  y1 * this.numOfColumns + x1,
            cell0 = this.grid[index0],
            cell1 = this.grid[index1];
        if (!cell0 || !cell1) return;

        let length0 = cell0.length,
            length1 = cell1.length;

        // Mark all pairs
        for (let i = 0; i < length0; ++i) {
            const obj0 = cell0[i];
            for (let j = 0; j < length1; ++j) {
                const obj1 = cell1[j];
                this.checks.push(obj0, obj1);
            }
        }
    }
}
