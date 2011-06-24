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
    var green = 'rgba(150,255,0, 1)';
    var yellow = 'rgba(255,255,0, 1)';
    var red = 'rgba(255,0,0, 1)';

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

        audioLibParams = {
            test : ["square",0.0000,0.4000,0.0000,0.1220,0.0000,0.2060,315.0000,1399.0000,2400.0000,-0.9120,0.0000,0.0000,0.0100,0.0003,0.0000,0.0000,0.0000,0.0915,0.1960,0.0000,0.0000,0.0000,1.0000,0.0000,0.0000,0.0930,0.0000],
            explosion : ["noise",0.0000,0.4000,0.0000,0.3440,0.3720,0.4400,20.0000,1792.0000,2400.0000,-0.2040,0.0000,0.0000,0.0100,0.0003,0.0000,0.0000,0.0000,0.0000,0.0000,0.7872,0.0000,0.0000,1.0000,0.0000,0.0000,0.0000,0.0000],
            tone : ["sine",0.0000,0.5000,0.0000,2.0000,1.0000,1.0000,20.0000,400.0000,2400.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,0.0000,1.0000,0.0000,0.0000,0.0000,0.0000]
            };

        samples = jsfxlib.createWaves(audioLibParams);
        //samples.test.play();
        //samples.explosion.play();

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
        var background_gradient = context.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, height / 1.1);
        background_gradient.addColorStop(0, '#444');
        background_gradient.addColorStop(1, '#000');
        context.globalAlpha = 1.0;
        context.fillStyle = background_gradient;
        context.fillRect(0, 0, width, height);
    }

    function drawCircles() {
        for(var i=0; i < circles.length; i++) {
            context.fillStyle = circles[i].color;
            context.globalAlpha = circles[i].alpha;
            context.beginPath();
            context.arc(circles[i].x, circles[i].y, circles[i].radius, 0, Math.PI * 2, true);
            context.closePath();
            context.fill();
            circles[i].alpha = circles[i].alpha - .005;
            circles[i].radius = circles[i].radius + .5;
            if(circles[i].alpha < 0) {
                circles[i].alpha = 1;
                circles[i].radius = 1;
                samples.tone.play();
            }
        }
    }

    function addCircle(x, y) {
        var circle = {};
        circle.x = x;
        circle.y = y;
        circle.radius = 1;
        if(x < width/3) {
            circle.color = red;
        } else if(x < 2*width/3) {
            circle.color = yellow;
        } else {
            circle.color = green;
        }
        circle.alpha = 1.0;
        circles.push(circle);
        samples.tone.play();
    }

    function eventMouseUp(event) {
        var mouseX;
        var mouseY;
        if(event.layerX || event.layerX == 0) { // Firefox
            mouseX = event.layerX ;
            mouseY = event.layerY;
        } else if(event.offsetX || event.offsetX == 0) { // Opera
            mouseX = event.offsetX;
            mouseY = event.offsetY;
        }
        addCircle(mouseX, mouseY);var circle = {};
    }

    canvas.addEventListener("mouseup" ,eventMouseUp, false);

    // Begin the entire process
    switchGameState(STATE_INIT);
    const FRAME_RATE = 30;
    var intervalTime = 1000 / FRAME_RATE;
    setInterval( run, intervalTime );
}

