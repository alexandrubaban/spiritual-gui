// http://ie.microsoft.com/testdrive/Performance/PageVisibility/Default.html

var background = document.getElementById("Img1");
var border = document.getElementById("Img2");
var grid = document.getElementById("Img3");
var WIDTH = 1080;
var startPosition = 1048;
var HEIGHT = 300;
var animTime = 60000;
var numHistory = 0;
var ctx;
var visibilityHistory = [];

function init() {
    var canvas = document.getElementById("canvas");
    ctx = canvas.getContext('2d');
    ctx.textAlign = "center";
    ctx.font = '16px "Segoe UI"';
    ctx.lineWidth = 5;
    ctx.lineCap = "round";

    if (typeof document.hidden != "undefined" || typeof document.msHidden != "undefined" ||
	typeof document.webkitHidden != "undefined" || typeof document.mozHidden != "undefined") 
    {

        if (typeof document.hidden != "undefined") 
	{
		numHistory = visibilityHistory.unshift(new state(!document.hidden, numHistory + 1));
		if (addEventListener) document.addEventListener("visibilitychange", visibilityChange);
	}
        else if (typeof document.msHidden != "undefined") 
	{
		numHistory = visibilityHistory.unshift(new state(!document.msHidden, numHistory + 1));
		if (addEventListener) document.addEventListener("msvisibilitychange", visibilityChange);
	}
	else if (typeof document.webkitHidden != "undefined") 
	{
		numHistory = visibilityHistory.unshift(new state(!document.webkitHidden, numHistory + 1));
		if (addEventListener) document.addEventListener("webkitvisibilitychange", visibilityChange);
	}
	else if (typeof document.mozHidden != "undefined") 
	{
		numHistory = visibilityHistory.unshift(new state(!document.mozHidden, numHistory + 1));
		if (addEventListener) document.addEventListener("mozvisibilitychange", visibilityChange);
	}

        if (window.requestAnimationFrame) window.requestAnimationFrame(renderLoop);
        else if (window.msRequestAnimationFrame) window.msRequestAnimationFrame(renderLoop);
        else if (window.mozRequestAnimationFrame) window.mozRequestAnimationFrame(renderLoop);
        else if (window.webkitRequestAnimationFrame) window.webkitRequestAnimationFrame(renderLoop);
    }
    else displayWarning();
}

function state(visibility, index) {
    this.visibility = visibility;
    this.time = new Date();
    this.timeStamp = this.time.getTime();
    this.index = index;
    this.startX = 0;
    this.endX = 0;
}

function displayWarning() {
    ctx.drawImage(grid, 0, 0, WIDTH, HEIGHT);
    document.getElementById("DemoWarning").style.display = "block";
}

function visibilityChange() {
    if (typeof document.hidden != "undefined") numHistory = visibilityHistory.unshift(new state(!document.hidden, numHistory + 1));
    else if (typeof document.msHidden != "undefined") numHistory = visibilityHistory.unshift(new state(!document.msHidden, numHistory + 1));
    else if (typeof document.webkitHidden != "undefined") numHistory = visibilityHistory.unshift(new state(!document.webkitHidden, numHistory + 1));
    else if (typeof document.mozHidden != "undefined") numHistory = visibilityHistory.unshift(new state(!document.mozHidden, numHistory + 1));
}

function drawLine(state) {
    ctx.save();
    
    if (state.visibility) {
        ctx.strokeStyle = "lightgreen";
        ctx.fillStyle = "lightgreen";
        ctx.textBaseline = "bottom";
    }
    else {
        ctx.strokeStyle = "red";
        ctx.fillStyle = "red";
        ctx.textBaseline = "top";
    }
    ctx.save();
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 12;
    ctx.shadowColor = "rgba(255, 255, 255, 1)";
    ctx.beginPath();
    ctx.moveTo(state.startX, 150);
    ctx.lineTo(state.endX,150);
    ctx.stroke();
    ctx.arc(state.startX, 150, 2.5, 0, 2 * Math.PI, true);
    ctx.arc(state.endX, 150, 2.5, 0, 2 * Math.PI, true);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.font = '10px "Segoe UI"';
    ctx.fillText(state.time.toLocaleTimeString(), state.endX, 150);
    ctx.restore();    
    
    ctx.restore();
}

function drawLegend() {
    
}

function renderLoop(timestamp) {
    // Draw background
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    ctx.drawImage(background, 0, 0, WIDTH, HEIGHT);
    
    // Get current time
    var curTime = new Date().getTime();
    
    for (i = 0; i < numHistory; i++) {
        
        // For each visibility state, recalculate current startX, endX (draw lines from left to right)
        if (i == 0) visibilityHistory[i].startX = startPosition;
        else visibilityHistory[i].startX = visibilityHistory[i-1].endX-7;

        visibilityHistory[i].endX = Math.ceil(startPosition - (startPosition * (curTime - visibilityHistory[i].timeStamp) / animTime));
        
        // Draw line
        drawLine(visibilityHistory[i]);
        
        // If startX is off screen, remove from array
        if (visibilityHistory[i].startX < 0 && visibilityHistory[i].endX < 0) {
            numHistory--;
            visibilityHistory.pop();
        }
    }

    ctx.drawImage(border, 0, 0, WIDTH, HEIGHT);
    
    if (window.requestAnimationFrame) window.requestAnimationFrame(renderLoop);
    else if (window.msRequestAnimationFrame) window.msRequestAnimationFrame(renderLoop);
    else if (window.mozRequestAnimationFrame) window.mozRequestAnimationFrame(renderLoop);
    else if (window.webkitRequestAnimationFrame) window.webkitRequestAnimationFrame(renderLoop);
    else setTimeout(renderLoop, 16.7);
}

init();