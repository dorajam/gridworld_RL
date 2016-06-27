var Action = function(name, dir) {
	this.name = name;
	this.dir = dir;
}

var p = Action.prototype;

p.render = function(ctx) {
	var dir = this.dir;
	var orthoDir = {x: -dir.y, y: dir.x};   // turn by 90 degrees
	var dirFactor = 10;    // length of arrow
	var orthoDirFactor = 4; // length of head

	ctx.beginPath();
	ctx.lineWidth = 2.5;
	ctx.lineCap = "round";
	ctx.lineJoin = "round";
	ctx.moveTo(0, 0);
	ctx.lineTo(dir.x * dirFactor, dir.y * dirFactor);

	ctx.lineTo(
		dir.x * dirFactor * 0.5 + orthoDir.x * orthoDirFactor,
		dir.y * dirFactor * 0.5 + orthoDir.y * orthoDirFactor
	);
	ctx.moveTo(dir.x * dirFactor, dir.y * dirFactor);
	ctx.lineTo(
		dir.x * dirFactor * 0.5 - orthoDir.x * orthoDirFactor,
		dir.y * dirFactor * 0.5 - orthoDir.y * orthoDirFactor
	);
	ctx.stroke();
}

Action.actions = {};
Action.actions["up"] = new Action("up", {x: 0, y: -1});
Action.actions["down"] = new Action("down", {x: 0, y: 1});
Action.actions["right"] = new Action("right", {x: 1, y: 0});
Action.actions["left"] = new Action("left", {x: -1, y: 0});

Action.getActions = function() {
	var actions = [];
	for (var actionName in Action.actions) {
		actions.push(Action.actions[actionName]);
	}
	return actions;
}

Action.getActionByName = function(name) {
	return Action.actions[name];
}

module.exports = Action;
