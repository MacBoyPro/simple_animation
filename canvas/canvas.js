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
    
    this.direction = { 'x' : 1, 'y' : 1 };
    
    this.center = { 'x' : this.radius * 2, 'y' : this.radius * 2 };
    
    this.draw = function (magnitude) {
        this.context.fillStyle=this.color;
        this.context.beginPath();
        
        // Calculate the new x value
        var currentX = this.center.x - this.radius;
        var vectorX = currentX + ( magnitude * this.direction.x );
        this.center.x = vectorX + this.radius;
        
        // Calculate the new y value
        var currentY = this.center.y - this.radius;
        var vectorY = currentY + (magnitude * this.direction.y);
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
            if (!this.pongSound) { this.pongSound = document.getElementById('pong') };
            this.pongSound.Play(); 
        };
    };
};

function paddle(theContext, theCanvasWidth) {
    this.context = theContext;
    this.canvasWidth = theCanvasWidth;
    this.width = 200;
    this.height = 75;
    this.color = "#0000FF";
    
    this.direction = 0;
    
    this.center = { 'x' : this.width, 'y' : this.height };
    
    this.draw = function (magnitude) {
        this.context.fillStyle = this.color;
        
        var halfWidth = this.width / 2;
        var currentX = this.center.x - halfWidth;
        var vectorX = currentX;
        if(this.direction != 0) {
            // Calculate the new x value
            vectorX += magnitude * this.direction;
            this.center.x = vectorX + halfWidth;
        }
        
        this.context.fillRect(vectorX, 
                              this.center.y, 
                              this.width, 
                              this.height);
                              
        this.collisionDetect();                          
    };
    
    this.collisionDetect = function() {
        var collision = false;
        var halfWidth = this.width / 2;
        if(this.center.x + halfWidth >= this.canvasWidth || this.center.x - halfWidth < 0) {
            
            this.direction = 0;
        }
    };
};

BRICKOUT = {};
BRICKOUT.canvas = null;

BRICKOUT.context = null;
BRICKOUT.canvasWidth = 1000;
BRICKOUT.canvasHeight = 500;

BRICKOUT.ball = null;
BRICKOUT.paddle = null;

BRICKOUT.magnitude = 2;

BRICKOUT.timerInterval = 1000 / 60; //Update the display 60 times per second
BRICKOUT.timer = null;

BRICKOUT.clearContext = function () { 
    BRICKOUT.context.clearRect ( 0 , 0 , BRICKOUT.canvasWidth , BRICKOUT.canvasHeight ); 
};

BRICKOUT.draw = function() {
    BRICKOUT.clearContext();
    BRICKOUT.ball.draw(BRICKOUT.magnitude);
    BRICKOUT.paddle.draw(BRICKOUT.magnitude);
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