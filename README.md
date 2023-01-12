HTML5 Canvas Node Garden
==========================

The demo uses a uniform grid for space partitioning in order to do a faster neighbour lookup (basically collision detection) with a lot of objects.

We basically just draw a line between two particles if they are within a certain distance from each other.

Particles also have a simple spring acceleration towards one another, which can make for some complex looking shapes.

The grid algorithm and basic idea is presented in [AdvancED ActionScript Animation](http://www.amazon.com/AdvancED-ActionScript-Animation-Friends-Learning/dp/1430216085) by Keith Peters.

We use a uniform grid with the cell size being as large as our largest object in the scene, then we only need to check each cell and its surrounding neighbours for possible collisions,
and not loop through all objects and check all of them.

It does have a lot of overhead of keeping track of all the objects in the scene, but by balancing the choice of cell size, and the number of objects in the scene, we can usually get a few times faster than the naive O(n^2) algorithm.

Running
---------

Just open `index.html` in your browser.

`gridtest.html` is a demo app for testing the `ObjectsGrid` class.
