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


