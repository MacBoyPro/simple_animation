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
    
    this.center = { 'x' : (this.canvasWidth / 2) - (this.width / 2), 
                    'y' : 450 - (this.height / 2) };
    
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

function brick(theContext) {
    
    this.context = theContext;
    this.width = 100;
    this.height = 50;
    this.color = {};
    this.alpha = 0.8;
    
    this.center = { 'x' : 0, 
                    'y' : 0 };
    
    this.draw = function() {
        
        this.context.fillStyle = "rgba(0,200,0," + this.alpha + ")";
        this.context.globalAlpha = this.alpha;
        
        var halfWidth = this.width / 2;
        this.context.fillRect(this.center.x - halfWidth, 
                                  this.center.y - this.height / 2, 
                                  this.width, 
                                  this.height);
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

BRICKOUT.numBricks = 10;
BRICKOUT.numRows = 2;
BRICKOUT.bricks = null;
BRICKOUT.brickWidth = 100;
BRICKOUT.brickHeight = 50;

BRICKOUT.score = 0;

BRICKOUT.timerInterval = 1000 / 60; //Update the display 60 times per second
BRICKOUT.timer = null;

BRICKOUT.clearContext = function () { 
    BRICKOUT.context.clearRect ( 0 , 0 , BRICKOUT.canvasWidth , BRICKOUT.canvasHeight ); 
};

BRICKOUT.draw = function() {
    BRICKOUT.clearContext();
    BRICKOUT.ball.draw();
    BRICKOUT.paddle.draw();
    
    var x,y;
    for(y = 0; y < BRICKOUT.numRows; y++) {
        for(x = 0; x < BRICKOUT.numBricks; x++) {
            BRICKOUT.bricks[x][y].draw();
        }
    }
    
    var paddleCollision = BRICKOUT.ball.center.y >= BRICKOUT.paddle.center.y - (BRICKOUT.paddle.height / 2) &&
                          BRICKOUT.ball.center.y <= BRICKOUT.paddle.center.y + (BRICKOUT.paddle.height / 2) &&
                          BRICKOUT.ball.center.x >= BRICKOUT.paddle.center.x - (BRICKOUT.paddle.width / 2) &&
                          BRICKOUT.ball.center.x <= BRICKOUT.paddle.center.x + (BRICKOUT.paddle.width / 2);
                          
    if(paddleCollision) {
        BRICKOUT.ball.direction.y = -BRICKOUT.ball.direction.y;
        if (!BRICKOUT.pongSound) { BRICKOUT.pongSound = document.getElementById('pong'); };
            BRICKOUT.pongSound.Play(); 
    }        
    
    for(y = 0; y < BRICKOUT.numRows; y++) {
        for(x = 0; x < BRICKOUT.numBricks; x++) {
            
            if(BRICKOUT.bricks[x][y].alpha > 0 && BRICKOUT.intersect(BRICKOUT.ball,BRICKOUT.bricks[x][y])) {
                BRICKOUT.processCollision(BRICKOUT.bricks[x][y]);
                //pongSound.Play();
            }
        }
    }
    
};

BRICKOUT.processCollision = function(brick) {
    
    BRICKOUT.score += 10;

    var brickLeft = brick.center.x - brick.width / 2;
    var brickTop = brick.center.y - brick.height / 2;
    
    var ballXVector = BRICKOUT.ball.magnitude * BRICKOUT.ball.direction.x;
    var ballYVector = BRICKOUT.ball.magnitude * BRICKOUT.ball.direction.y;
    
    if(brickLeft - BRICKOUT.ball.center.x <= BRICKOUT.ball.magnitude) {
        BRICKOUT.xVector = -BRICKOUT.xVector;
    } else if (BRICKOUT.ball.center.x - (brickLeft + brick.width) <= BRICKOUT.ball.magnitude) {
        BRICKOUT.ball.direction.x = -BRICKOUT.ball.direction.x;
    }
    
    if(brickTop - BRICKOUT.ball.center.y <= BRICKOUT.ball.magnitude) {
        BRICKOUT.ball.direction.y = -BRICKOUT.ball.direction.y;
    } else if (BRICKOUT.ball.center.y - (brickTop + brick.height) <= BRICKOUT.ball.magnitude) {
        BRICKOUT.ball.direction.y = -BRICKOUT.ball.direction.y;
    }
    
    brick.alpha = 0.0;
};

BRICKOUT.intersect = function(elementOne,elementTwo) {
    
    var intersected = false;
      
    var elemOneLeft = elementOne.center.x - elementOne.width / 2; 
    var elemOneTop = elementOne.center.y - elementOne.height / 2;
    
    var elemTwoLeft = elementTwo.center.x - elementTwo.width / 2; 
    var elemTwoTop = elementTwo.center.y - elementTwo.height / 2;
    
    if(elementOne.center.x >= elementTwo.center.x && 
       elementOne.center.x <= (elementTwo.center.x+elementTwo.width) &&
       elementOne.center.y >= elementTwo.center.y && 
       elementOne.center.y <= (elementTwo.center.y+elementTwo.height)) {
        intersected = true;
    }
    
    if(elementTwo.center.x >= elementOne.center.x && 
       elementTwo.center.x <= (elementOne.center.x+elementOne.width) &&
       elementTwo.center.y >= elementOne.center.y && 
       elementTwo.center.y <= (elementOne.center.y+elementOne.height)) {
        intersected = true;
    }
    
    return intersected;
}

BRICKOUT.initializeBricks = function() {
    var brickTypes = ['#000000', '#FF6103', '#00FF00', '#FFFF00'];
    
    BRICKOUT.bricks = new Array(BRICKOUT.numBricks);
    
    var count = 0;
    var x,y;
    
    for(x = 0; x < BRICKOUT.numBricks; x++) {
        BRICKOUT.bricks[x] = new Array(BRICKOUT.numRows);
    }
    
    for(y = 0; y < BRICKOUT.numRows; y++) {
        for(x = 0; x < BRICKOUT.numBricks; x++) {
            var color = brickTypes[(count++ % brickTypes.length)];
            var leftPos = x * BRICKOUT.brickWidth;
            var topPos = y * BRICKOUT.brickHeight;
            
            BRICKOUT.bricks[x][y] = new brick(BRICKOUT.context);
            BRICKOUT.bricks[x][y].width = BRICKOUT.brickWidth;
            BRICKOUT.bricks[x][y].height = BRICKOUT.brickHeight;
            BRICKOUT.bricks[x][y].color = { 'r' : 0, 'g' : 255, 'b' : 0 };
            BRICKOUT.bricks[x][y].center = { 'x' : leftPos + BRICKOUT.brickWidth/2, 
                                             'y' : topPos + BRICKOUT.brickHeight/2 };
        }
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
    // choose whether the ball moves left or right to start with
    if(Math.floor(Math.random()*101) < 50)
        BRICKOUT.ball.direction.x = -BRICKOUT.ball.direction.x;
        
    BRICKOUT.paddle = new paddle(context, BRICKOUT.canvasWidth);
    BRICKOUT.initializeBricks();
    
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