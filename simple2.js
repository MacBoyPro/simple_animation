function ball() {
    
    this.element = document.createElement('div');
    this.element.id = "ball";
    this.element.width = "20";
    this.element.height = "20";
    this.element.style.left = "10px";
    this.element.style.top = "10px";
    this.container = document.getElementById('container');
    this.container.width = "800";
    this.container.appendChild(this.element);
    
    this.direction = 1;
    
    this.left = function() {
        return parseInt(this.element.style.left);
    }
    
    this.top = function() {
        return parseInt(this.element.style.top);
    }
    
    this.width = function() {
        return parseInt(this.element.width);
    }        
    
    this.height = function() {
        return parseInt(this.element.height);
    }        
    
    this.center = { 'x' : this.width() / 2, 
                    'y' : this.height() / 2 };
    
    this.draw = function (magnitude) {

        var currentLeft = this.left();
        if (isNaN(currentLeft)) { currentLeft = 0 };

        var vector = currentLeft + (magnitude * this.direction);
        this.center.x = vector + (this.width() / 2);
        
        this.collisionDetect();
        this.element.style.left = vector + "px";
        console.log(this.element.style.left);
    };
    
    this.collisionDetect = function() {
        var containerWidth = parseInt(this.container.width);
        
        var halfWidth = this.width() / 2;
        
        if (this.center.x + halfWidth >= containerWidth || this.center.x - halfWidth < 0) {
            this.direction = this.direction * -1;
            var pongSound = document.getElementById("pong");
            pongSound.Play();
         }
    };
};

ANIMATION = {};

ANIMATION.ball = null;
ANIMATION.timer = null;
ANIMATION.timerInterval = 1000 / 30;
ANIMATION.currentTime = null;
ANIMATION.startTime = null;
ANIMATION.step = 10;
ANIMATION.frames = 0;
ANIMATION.magnitude = 1;
ANIMATION.currentTime = function () { 
    //getTime() - Returns the number of milliseconds since midnight Jan 1, 1970
    return (new Date).getTime(); 
};

ANIMATION.draw = function() {
    ANIMATION.frames += 1;
    ANIMATION.ball.draw(ANIMATION.magnitude);
    
    var fps = document.getElementById('fps');
    var time = (ANIMATION.currentTime() - ANIMATION.startTime);
    var currentFPS = (ANIMATION.frames / time) * 1000;
    fps.innerHTML = "FPS: " + currentFPS;
};

ANIMATION.start = function() {
    ANIMATION.ball = new ball();
    ANIMATION.startTime = ANIMATION.currentTime(); 
    ANIMATION.timer = setInterval(ANIMATION.draw, ANIMATION.timerInterval);
};