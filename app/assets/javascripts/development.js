global.Promise = require('bluebird');
global.Promise.longStackTraces();

function loadMemoryStats(){
  var MemoryStats = require('memory-stats');
  var stats = new MemoryStats();

  stats.domElement.style.position = 'fixed';
  stats.domElement.style.right        = '0px';
  stats.domElement.style.bottom       = '0px';

  document.body.appendChild( stats.domElement );

  requestAnimationFrame(function rAFloop(){
    stats.update();
    requestAnimationFrame(rAFloop);
  });
}

function loadStats(){
  var Stats = require('stats');
  var stats = new Stats();

  stats.setMode( 1 ); // 0: fps, 1: ms, 2: mb

  stats.domElement.style.position = 'fixed';
  stats.domElement.style.right        = '0px';
  stats.domElement.style.bottom       = '0px';

  document.body.appendChild( stats.domElement );

  requestAnimationFrame(function update(){
    stats.begin();
    // monitored code goes here
    stats.end();
    requestAnimationFrame( update );
  });
}

document.addEventListener("DOMContentLoaded", function(event) {
  if (window.memoryStats)
    loadMemoryStats();

  if (window.stats)
    loadStats();
});
