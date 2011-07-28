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
    
    this.center = { 'x' : this.radius * 2, 'y' : this.radius * 2 };
    
    this.draw = function () {
        this.context.fillStyle=this.color;
        this.context.beginPath();
        
        // Calculate the new x value
        var currentX = this.center.x - this.radius;
        var vectorX = currentX + ( this.magnitude * this.direction.x );
        this.center.x = vectorX + this.radius;
        
        // Calculate the new y value
        var currentY = this.center.y - this.radius;
        var vectorY = currentY + (this.magnitude * this.direction.y);
        this.center.y = vectorY + this.radius;
        
        this.context.arc(vectorX,
                         vectorY,
                         this.radius,
                         this.startAngle,
                         this.endAngle,
                         this.antiClockwise);
        this.context.closePath();
        this.context.fill();
        
        this.collisionDetect();
    };
    
    this.collisionDetect = function() {
        var collision = false;
        if(this.center.x + this.radius >= this.canvasWidth || this.center.x - this.radius < 0) {
            console.log("HIT");
            this.direction.x = this.direction.x * -1;
            collision = true;
        }
        
        if(this.center.y + this.radius >= this.canvasHeight || this.center.y - this.radius < 0) {
            console.log("HIT");
            this.direction.y = this.direction.y * -1;
            collision = true;
        }
        
        if(collision) { 
            if (!this.pongSound) { this.pongSound = document.getElementById('pong'); };
            this.pongSound.Play(); 
        };
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
    
    this.center = { 'x' : this.width, 'y' : 400 - (this.height / 2) };
    
    this.draw = function () {
        this.context.fillStyle = this.color;
        
        // Calculate the new x value
        var halfWidth = this.width / 2;
        var currentLeft = this.center.x - halfWidth;
        var newLeft = currentLeft + this.magnitude * this.direction;
        var newCenterX = newLeft + halfWidth;
        
        if(!this.collisionDetect(newCenterX)){ 
            this.center.x = newCenterX
         }  
         
         this.context.fillRect(this.center.x - halfWidth, 
                                  this.center.y - this.height / 2, 
                                  this.width, 
                                  this.height);
    };
    
    this.collisionDetect = function(newPos) {
        var collision = false;
        var halfWidth = this.width / 2;
        if(newPos + halfWidth > this.canvasWidth || newPos - halfWidth < 0) {
            collision = true;
        }
        
        return collision;
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
    
    var paddleCollision = BRICKOUT.ball.center.y >= BRICKOUT.paddle.center.y - (BRICKOUT.paddle.height / 2) &&
                          BRICKOUT.ball.center.y <= BRICKOUT.paddle.center.y + (BRICKOUT.paddle.height / 2) &&
                          BRICKOUT.ball.center.x >= BRICKOUT.paddle.center.x - (BRICKOUT.paddle.width / 2) &&
                          BRICKOUT.ball.center.x <= BRICKOUT.paddle.center.x + (BRICKOUT.paddle.width / 2);
                          
    if(paddleCollision) {
        BRICKOUT.ball.direction.y = -BRICKOUT.ball.direction.y;
        if (!BRICKOUT.pongSound) { BRICKOUT.pongSound = document.getElementById('pong'); };
            BRICKOUT.pongSound.Play(); 
    }                      
};

BRICKOUT.currentTime = function() {
    //getTime() - Returns the number of milliseconds since midnight Jan 1, 1970
    return (new Date).getTime();
};

BRICKOUT.start = function (context,canvas) {
    BRICKOUT.canvas = canvas;
    BRICKOUT.context = context;
    BRICKOUT.clearContext();
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