var Action = require("./Action");

var State = function(world, i, j, reward) {
	this.world = world;
	this.i = i;
	this.j = j;
	this.reward = reward;
	// for value iteration
	this.value = 0;
}

var p = State.prototype;

p.getValueColor = function(agent) {
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
	var bestState = world.getStateAt(0, 0);
	for (var i = 0; i < world.height; i++) {
		for (var j = 0; j < world.width; j++) {
			var state = world.getStateAt(i, j);
			if (Math.abs(agent.getValue(state, true)) > Math.abs(agent.getValue(bestState, true))) {
				bestState = state;
			}
		}
	}

	var t;
	if (agent.getValue(bestState, true) == 0) t = 0;
	else t = Math.abs(agent.getValue(this, true) / agent.getValue(bestState, true));
	var targetColor;
	if (agent.getValue(this, true) < 0) targetColor = red;
	else targetColor = green;

	return rgbaToString(blendColors(white, targetColor, t));
}

p.render = function(ctx, agent) {
	// TODO this size variable should be somewhere else
	var size = 80;
	var x = this.j * size;
	var y = this.i * size;
	var possibleActions = this.getPossibleActions();

	ctx.beginPath();

	ctx.fillStyle = this.getValueColor(agent);
	ctx.rect(x, y, size, size);
	ctx.fill();
	ctx.stroke();

	ctx.beginPath();
	ctx.fillStyle = "black";
	ctx.textAlign = "center";
	ctx.fillText("R: " + this.reward, x + size * 0.5, y + size * 0.5 - 25);
	var value = agent.getValue(this);
	value = Math.round(value * 100) / 100;
	ctx.fillText("V: " + value, x + size * 0.5, y + size * 0.5 - 13);
	ctx.stroke();

	ctx.save();
	ctx.translate(x + size / 2, y + size / 2);
	var bestAction = agent.getBestAction(this);
	bestAction.render(ctx);
	ctx.restore();
}

p.getPossibleActions = function() {
	var i = this.i;
	var j = this.j;
	var world = this.world;
	var actions = [];
	if (i > 0) actions.push(Action.getActionByName("up"));
	if (i < world.height - 1) actions.push(Action.getActionByName("down"));
	if (j > 0) actions.push(Action.getActionByName("left"));
	if (j < world.width - 1) actions.push(Action.getActionByName("right"));
	return actions;
}

p.getNeighbors = function() {
	var i = this.i;
	var j = this.j;
	var world = this.world;
	var neighbors = [];
	if (i > 0) neighbors.push(world.getStateAt(i - 1, j));
	if (i < world.height - 1) neighbors.push(world.getStateAt(i + 1, j));
	if (j > 0) neighbors.push(world.getStateAt(i, j - 1));
	if (j < world.width - 1) neighbors.push(world.getStateAt(i, j + 1));
	return neighbors;
}

p.getNextState = function(action) {
	var i = this.i;
	var j = this.j;
	var world = this.world;
	switch (action.name) {
		case "down":
			return world.getStateAt(i + 1, j);
		case "up":
			return world.getStateAt(i - 1, j);
		case "right":
			return world.getStateAt(i, j + 1);
		case "left":
			return world.getStateAt(i, j - 1);
	}
}

module.exports = State;
