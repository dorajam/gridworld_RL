

var State = function(world, row, col) {
  this.world = world;
  this.row = row;
  this.col = col;
  this.reward = 0;
  this.value = 0;
}

var p = State.prototype;

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

p.getValueColor = function() {
  

  return 'rgba(134,180,234,1)';
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

module.exports = State;
