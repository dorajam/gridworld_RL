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
    }}}


module.exports = World;
