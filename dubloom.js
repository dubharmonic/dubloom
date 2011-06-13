window.addEventListener('load', eventWindowLoaded, false);    

function eventWindowLoaded() {
    dubloom();
}

function dubloom() {

    if (!Modernizr.canvas) {
        return false;
    }

    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    var width = canvas.width;
    var height = canvas.height;
    context.strokeStyle = 'rgba(0,0,0,.5)'
    context.shadowColor = 'rgba(0,0,0,1)';
    context.shadowBlur = 20;
    context.lineWidth = 10;
    context.lineCap = 'round';
    

    // Application States
    const STATE_INIT = 0;
    const STATE_WAIT = 1;
    const STATE_WAIT_FOR_LOAD = 2;
    const STATE_TITLE = 3;
    const STATE_PLAY = 4;

    var circles = [];
    
    function run() {
        currentGameStateFunction();
    }
    
    function switchGameState(newState) {
        currentGameState = newState;
        switch (currentGameState) {
            case STATE_INIT:
                currentGameStateFunction = init;
                break;
            case STATE_WAIT:
                currentGameStateFunction = wait;
                break;
            case STATE_WAIT_FOR_LOAD:
                currentGameStateFunction = waitForLoad;
                break;
            case STATE_TITLE:
                currentGameStateFunction = title;
                break;
            case STATE_PLAY:
                currentGameStateFunction = play;
                break;
        }
    }

    function init() {
        console.log("init");
        switchGameState(STATE_WAIT_FOR_LOAD);
    }

    function wait() {
        console.log("wait");
    }

    function waitForLoad() {
        console.log("wait for load");
        switchGameState(STATE_TITLE);
    }

    function title() {
        console.log("title");
        switchGameState(STATE_PLAY);
    }

    function play() {
        drawBackground();  
        drawCircles();
    }

    function drawBackground() {
        var background_gradient = context.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, height / 1.6);
        background_gradient.addColorStop(0, '#888');
        background_gradient.addColorStop(1, '#000');
        context.globalAlpha = 1.0;
        context.fillStyle = background_gradient;
        context.fillRect(0, 0, width, height);
    }

    function drawCircles() {
        if(circles.length < 10) {
            addRandomCircle();
        }
        addRandomCircle();
        circles.shift();

        for(var i=0; i < circles.length; i++) {
            context.fillStyle = circles[i].color;
            context.globalAlpha = circles[i].alpha;
            context.beginPath();
            context.arc(circles[i].x, circles[i].y, circles[i].radius, 0, Math.PI * 2, true);
            context.closePath();
            context.fill();
            circles[i].alpha = circles[i].alpha - .1;
        }
    }

    function addRandomCircle() {
        var circle = {};
        circle.x = Math.floor(width * Math.random());
        circle.y = Math.floor(height * Math.random());
        circle.radius = Math.floor(40 * Math.random());
        circle.color = 'rgba(150,255,0, 1)';
        circle.alpha = 1.0;
        circles.push(circle);
    }

    // Begin the entire process
    switchGameState(STATE_INIT);
    const FRAME_RATE = 40;
    var intervalTime = 1000 / FRAME_RATE;
    setInterval( run, intervalTime );
}

