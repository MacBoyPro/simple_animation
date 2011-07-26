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
    
    this.width = function() {
        return parseInt(this.element.width);
    };
    
    this.height = function() {
        return parseInt(this.element.height);
    };
    
    this.left = function() {
        return parseInt(this.element.style.left);
    };
    
    this.top = function() {
        return parseInt(this.element.style.top);
    };
    
    this.center = { 'x' : (this.width() / 2) + this.left(), 
                    'y' : (this.height() / 2) + this.top() };
                    
    this.direction = 1;                
                    
    this.draw = function(magnitude) {
        var currentLeft = this.left();
        if(isNaN(currentLeft)) { currentLeft = 0 };
        
        var vector = magnitude * this.direction;
        var vectorX = currentLeft + vector;
        this.center.x = vectorX + (this.width() / 2);
        this.element.style.left = vectorX + 'px';
        this.collisionDetect();
    };  
    
    this.collisionDetect = function() {
        var containerWidth = parseInt(this.container.width);
        var halfWidth = this.width() / 2;
        if(this.center.x + halfWidth >= containerWidth ||
           this.center.x - halfWidth < 0)
            this.direction = this.direction * -1;
    };
};

ANIMATION = {};

ANIMATION.ball = null;
ANIMATION.startTime = null;
ANIMATION.timer = null;
ANIMATION.timerInterval = 1000 / 30;
ANIMATION.magnitude = 1;

ANIMATION.currentTime = function() {
    //getTime() - Returns the number of milliseconds since midnight Jan 1, 1970
    return (new Date).getTime();
};

ANIMATION.draw = function() {
    ANIMATION.ball.draw(ANIMATION.magnitude);
};

ANIMATION.start = function() {
    ANIMATION.ball = new ball();
    ANIMATION.startTime = ANIMATION.currentTime();
    ANIMATION.timer = setInterval(ANIMATION.draw, ANIMATION.timerInterval);
};