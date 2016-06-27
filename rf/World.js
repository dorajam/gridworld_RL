var State = require("./State");
var Action = require("./Action");
var Agent = require("./Agent");

var World = function(width, height) {
  this.width = width;
  this.height = height;

  var states = this.states = [];
  this.agents = [];

  for (var i = 0; i < height; i++) {
    states.push([]);
    for (var j = 0; j < width; j++) {
      var row = states[i];
      var state = new State(this, i, j, 0);
      row.push(state);
    }
  }
}

World.newFromRewards = function(rewards) {
  var height = rewards.length;
  var width = rewards[0].length;
  var world = new World(width, height);

  for (var i = 0; i < height; i++) {
    for (var j = 0; j < width; j++) {
      var state = world.getStateAt(i, j);
      state.reward = rewards[i][j];
    }
  }

  return world;
}

var p = World.prototype;

p.addAgent = function(state) {
  var agent = new Agent(this, state);
  this.agents.push(agent);
  return agent;
}

p.step = function() {
  for (var i = 0; i < this.agents.length; i++) {
    var agent = this.agents[i];
    agent.step();
  }
}

p.render = function(ctx, agent) {
  var states = this.states;
  for (var i = 0; i < states.length; i++) {
    for (var j = 0; j < states[i].length; j++) {
      var state = this.getStateAt(i, j);
      state.render(ctx, agent);
    }
  }

  var agents = this.agents;
  for (var i = 0; i < agents.length; i++) {
    var agent = agents[i];
    agent.render(ctx);
  }
}

p.getStateAt = function(i, j) {
  return this.states[i][j];
}

p.valueIteration = function() {
  // TODO gamma should be defined somewhere else
  var gamma = 0.01;

  for (var i = 0; i < this.height; i++) {
    for (var j = 0; j < this.width; j++) {
      var state = this.getStateAt(i, j);
      var neighbors = state.getNeighbors();
      var bestNeighbor = neighbors[0];
      // follow best neighbor state (highest value)
      for (var k = 1; k < neighbors.length; k++) {
        var neighbor = neighbors[k];
        if (neighbor.value > bestNeighbor.value) {
          bestNeighbor = neighbor;
        }
      }
      state.value = state.reward + 0.8 * bestNeighbor.value;
    }
  }
}

module.exports = World;
