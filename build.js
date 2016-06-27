(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
rf = require("./rf");     // if folder is specified, it looks for index.js

window.canvas = null;
window.ctx = null;
window.world = null;


function init() {
  canvas = document.createElement("canvas"); // "canvas" is the tag that will define the element
  document.body.appendChild(canvas);
  canvas.width =  700;
  canvas.height = 600;
  canvas.style.border = "1px solid black";
  ctx = canvas.getContext("2d");

  world = rf.World.newRandomWorld(7,7);

  requestAnimationFrame(update);
}

fps = 1;
function update() {
  setTimeout(
    function() {
      world.valueIteration();
      world.render(ctx);
      requestAnimationFrame(update);
    },
    1000 / fps
  );
}

init();



},{"./rf":4}],2:[function(require,module,exports){


var State = function(world, row, col) {
  this.world = world;
  this.row = row;
  this.col = col;
  this.reward = 0;
  this.value = 0;
}

var p = State.prototype;

// p.getValueColor = function() {
//   if (this.value == 0) {
//     return 'rgba(0,0,0,0)';
//   }

//   var neighbors = this.getNeighbors();
//   var highest = neighbors[0];
//   for (var i = 0; i < this.world.height; i++) {
//     for (var j =0; j < this.world.width; j++) {
//       var state = this.world.states[i][j];
//       if (state.value > highest.value) {
//         highest = state;
//       }
//     }
//   }
//   var ratio = Math.abs(this.value / highest.value);
//   var colors = blendColors(ratio, this.value);

//   return colors;
// }

p.getValueColor = function() {
	// TODO this function needs serious refactoring, see todos below

	// TODO this color processing code should be somewhere else
	var red = {r: 230, g: 83, b: 108, a: 1};
	var green = {r: 150, g: 250, b: 10, a: 1};
	var white = {r: 255, g: 255, b: 255, a: 1};
	var blendColors = function(a, b, t) {
		return {
			r: Math.floor(a.r * (1 - t) + b.r * t),
			g: Math.floor(a.g * (1 - t) + b.g * t),
			b: Math.floor(a.b * (1 - t) + b.b * t),
			a: a.a * (1 - t) + b.a * t
		};
	}
	var rgbaToString = function(rgba) {
		return "rgba(" +
			rgba.r + ", " +
			rgba.g + ", " +
			rgba.b + ", " +
			rgba.a +
		")";
	}

	// find the state with the best absolute value
	// TODO this is inefficient, this should not be computed again for each state
	var world = this.world;
	var bestState = world.states[0][0];
	for (var i = 0; i < world.height; i++) {
		for (var j = 0; j < world.width; j++) {
			var state = world.states[i][j];
			if (Math.abs(state.value) > Math.abs(bestState.value)) {
				bestState = state;
			}
		}
	}

	var t;
	if (bestState.value == 0) t = 0;
	else t = Math.abs(this.value / bestState.value);
	var targetColor;
	if (this.value < 0) targetColor = red;
	else targetColor = green;

	return rgbaToString(blendColors(white, targetColor, t));
}

p.render = function(ctx) {
  var size = 80;
  var x = this.col * size;
  var y = this.row * size;

  ctx.beginPath();
  ctx.fillStyle = this.getValueColor();
    ctx.rect(x,y,size,size);
    ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.textAlign = "center";
  ctx.fillText("R: " + Math.round(this.reward * 100)/100, x + size * 0.5, y + size* 0.5 - 25);
  ctx.fillText("V: " + Math.round(this.value * 100)/100, x + size * 0.5, y + size* 0.5 - 10);
  ctx.stroke();
}

p.getNeighbors = function() {
  var neighbors = [];
  var i = this.row;
  var j = this.col;
  if (i -1 >= 0) {
    neighbors.push(this.world.states[i-1][j]);
  }
  if (i + 1 < this.world.height) {
    neighbors.push(this.world.states[i+1][j]);
  }
  if (j -1 >= 0) {
    neighbors.push(this.world.states[i][j-1]);
  }
  if (j + 1 < this.world.width) {
    neighbors.push(this.world.states[i][j + 1]);
  }
  return neighbors;
}



// helper functions
// function blendColors(ratio, value) {
//   if (value < 0) {
//     return 'rgba(' + Math.round(230*ratio) + ',' + Math.round(83*(1-ratio)) + ',' + Math.round(108*(1-ratio)) + ',1)';
//   } else {
//     return 'rgba(' + Math.round(150*(1-ratio)) + ','+ Math.round(250*ratio) + ',' + Math.round(10*(1-ratio)) + ',1)';
//   } }

module.exports = State;

},{}],3:[function(require,module,exports){
var State = require("./State.js");

var World = function(width, height) {
  this.width = width;
  this.height = height;

  this.states = [];
  var states = this.states;

  for (var i = 0; i < height; i++) {
    states.push([]);
    for (var j = 0; j < width; j++) {
      var row = states[i];
      var state = new State(this, i, j);
      row.push(state);
    }
  }
};

// World is a class at this point -> no instance -> create class method that creates instance and populates it
World.newRandomWorld = function(width, height) {
  var world = new World(width, height);

  for (var i = 0; i < height; i++) {
    for (var j =0; j <width; j++) {
      var state = world.states[i][j];
      state.reward = Math.random();
    }
  }
  return world;
}

var p = World.prototype;

p.render = function(ctx) {
  var states = this.states;
  for (var i =0; i < this.height; i++) {
    for (var j = 0; j < this.width; j++) {
      var state = this.states[i][j];
      state.render(ctx);
    }
  }
}

// neightbors  -> max value

p.valueIteration = function() {
  var gamma = 0.8;

  for (var i = 0; i < this.height; i++) {
    for (var j =0; j < this.width; j++) {
      var state = this.states[i][j];

      var neighbors = state.getNeighbors();
      var bestNeighbor = neighbors[0];

      for (var k = 0; k < neighbors.length; k++) {
        var neighbor = neighbors[k];
        if (neighbor.value > bestNeighbor.value) {
          bestNeighbor = neighbor;
      }
      }
      state.value = state.reward + gamma * bestNeighbor.value;
    }
  }
}


module.exports = World;

},{"./State.js":2}],4:[function(require,module,exports){
module.exports = {
  State: require("./State.js"),
  World: require("./World.js")
}

},{"./State.js":2,"./World.js":3}]},{},[1]);
