var Action = require("./Action");

var Agent = function(world, state) {
	this.world = world;
	this.state = state;
	// Q(s, a) function / table
	// returns the value for arriving in state s,
	// leaving via action a,
	// and proceeding optimally thereafter
	// accessing q values: q[i][j][actionName]
	// e.g. q[2][3]["right"]
	this.q = [];
	var actions = Action.getActions();
	for (var i = 0; i < this.world.height; i++) {
		this.q.push([]);
		for (var j = 0; j < this.world.width; j++) {
			this.q[i].push({});
			for (var k = 0; k < actions.length; k++) {
				var action = actions[k];
				this.q[i][j][action.name] = 0;
			}
		}
	}
}

var p = Agent.prototype;

p.step = function() {
	// take some action
	var actions = this.state.getPossibleActions();
  var epsilon = 0.2;
  var action;
  if (Math.random() < epsilon) {
	  action = actions[Math.floor(Math.random() * actions.length)];
  } else {
    action = this.getBestAction(this.state);
  }
	var actionResult = this.evalAction(action);

	// receive reward, perceive new state
	var reward = actionResult.reward;
	var newState = actionResult.newState;

	// update Q based on this new experience
	this.updateQ(this.state, action, newState, reward);

	// update current state
	this.state = newState;
}

p.render = function(ctx) {
	var radius = 15;

	// TODO tileSize should be defined somewhere else
	var tileSize = 80;
	var x = this.state.j * tileSize;
	var y = this.state.i * tileSize;
	ctx.beginPath();
	ctx.fillStyle = "rgba(255, 255, 0, 0.7)";
	ctx.arc(x + tileSize * 0.5, y + tileSize * 0.5, radius, 0, 2 * Math.PI);
	ctx.fill();
	ctx.stroke();
}

p.evalAction = function(action) {
	var newState = this.state.getNextState(action);
	var reward = newState.reward;
	return {
		newState: newState,
		reward: reward
	};
}

p.getBestAction = function(state) {
	var possibleActions = state.getPossibleActions();
	var bestAction = possibleActions[0];
	for (var i = 1; i < possibleActions.length; i++) {
		var action = possibleActions[i];
		if (this.getQ(state, action) > this.getQ(state, bestAction)) {
			bestAction = action;
		}
	}
	return bestAction;
}

p.getValue = function(state, cir) {
	var considerImmediateReward;
	if (cir == null) considerImmediateReward = false;
	else considerImmediateReward = cir;

	var bestAction = this.getBestAction(state);
	var value = this.getQ(state, bestAction);
	// considerImmediateReward = true is used only
	// for debugging / rendering purposes.
	// The agent itself does not know the actual reward for each state
	// TODO this should consider gamma to be more accurate
	// value = state.reward + gamma * value
	if (considerImmediateReward) value += state.reward;
	return value;
}

p.getQ = function(state, action) {
	return this.q[state.i][state.j][action.name];
}

p.setQ = function(state, action, update) {
	this.q[state.i][state.j][action.name] = update;
}

p.updateQ = function(s, a, nextState, reward) {
	// TODO gamma and learningRate should be defined somewhere else
	var gamma = 0.8;
	var learningRate = 0.1;

	// we proceed optimally assuming our Q estimate is correct
  var bestAction = this.getBestAction(nextState);

	// add the optimal decision to the target value
	var targetValue = reward + gamma * this.getQ(nextState, bestAction);
  var average_update = this.getQ(s, a) * (1 - learningRate) + targetValue * learningRate;

  this.setQ(
		s, a, average_update);
}

module.exports = Agent;
