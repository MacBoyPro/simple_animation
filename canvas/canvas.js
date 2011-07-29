function ball(theContext, theCanvasWidth, theCanvasHeight) {
                    
    this.context = theContext;
    this.canvasWidth = theCanvasWidth;
    this.canvasHeight = theCanvasHeight;
    this.color = "#FF0000";
    this.radius = 10;
    this.startAngle = 0;
    this.endAngle = Math.PI*2;
    this.antiClockwise = true;
    this.pongSound = null;
    
    this.magnitude = 2;
    
    this.direction = { 'x' : 1, 'y' : 1 };
    
    this.center = { 'x' : this.canvasWidth / 2 - this.radius, 
                    'y' : this.canvasHeight / 2 - this.radius };
    
    this.draw = function () {

    };
    
    this.collisionDetect = function(newPosLeft, newPosTop) {

    };
};

function paddle(theContext, theCanvasWidth) {
    this.context = theContext;
    this.canvasWidth = theCanvasWidth;
    this.width = 75;
    this.height = 15;
    this.color = "#0000FF";
    
    this.direction = 0;
    this.isMoving = true;
    
    this.magnitude = 4;
    
    this.center = { 'x' : (this.canvasWidth / 2) - (this.width / 2), 
                    'y' : 450 - (this.height / 2) };
    
    this.draw = function () {

    };
    
    this.collisionDetect = function(newPos) {

    };
};

function brick(theContext) {
    
    this.context = theContext;
    this.width = 100;
    this.height = 50;
    this.color = null;
    this.alpha = 0.8;
    
    this.center = { 'x' : 0, 
                    'y' : 0 };
    
    this.draw = function() {
        

    };
};

BRICKOUT = {};
BRICKOUT.canvas = null;

BRICKOUT.context = null;
BRICKOUT.canvasWidth = 1000;
BRICKOUT.canvasHeight = 500;

BRICKOUT.ball = null;
BRICKOUT.paddle = null;

BRICKOUT.pongSound = null;

BRICKOUT.timerInterval = 1000 / 60; //Update the display 60 times per second
BRICKOUT.timer = null;

BRICKOUT.clearContext = function () { 
    BRICKOUT.context.clearRect ( 0 , 0 , BRICKOUT.canvasWidth , BRICKOUT.canvasHeight ); 
};

BRICKOUT.draw = function() {
    BRICKOUT.clearContext();
    BRICKOUT.ball.draw();
    BRICKOUT.paddle.draw();
};

BRICKOUT.currentTime = function() {
    //getTime() - Returns the number of milliseconds since midnight Jan 1, 1970
    return (new Date).getTime();
};

BRICKOUT.start = function (context,canvas) {
    BRICKOUT.canvas = canvas;
    BRICKOUT.context = context;
    BRICKOUT.ball = new ball(context, BRICKOUT.canvasWidth, BRICKOUT.canvasHeight);
    BRICKOUT.paddle = new paddle(context, BRICKOUT.canvasWidth);
    
    document.onkeydown = function(e){
        switch(e.keyCode) {
            case 37: // left
                BRICKOUT.paddle.direction = -1; 
                break;
            case 39: // right
                BRICKOUT.paddle.direction = 1;
                break;
        }
    }
    
    document.onkeyup=function(e){ 
        BRICKOUT.paddle.direction = 0;
    }
    
    BRICKOUT.startTime = BRICKOUT.currentTime();
    BRICKOUT.timer = setInterval(BRICKOUT.draw, BRICKOUT.timerInterval);
};