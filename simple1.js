ANIMATION = {};

ANIMATION.ball = null;
ANIMATION.timer = null;
ANIMATION.timerInterval = 1000 / 60;
ANIMATION.currentTime = null;
ANIMATION.startTime = null;
ANIMATION.currentTime = function () { 
    //getTime() - Returns the number of milliseconds since midnight Jan 1, 1970
    return (new Date).getTime(); 
};

ANIMATION.elapsedTime = function() { 
    previousElapsedNow = elapsedNow; 
    elapsedNow = now(); 
    return elapsedNow - startTime; 
};

ANIMATION.draw = function() {
    var step = (ANIMATION.currentTime() - ANIMATION.startTime) / ANIMATION.timerInterval;
    console.log(step);
    ANIMATION.ball.style.left = step + "px";
};

ANIMATION.start = function() {
    ANIMATION.ball = document.getElementById('ball');
    ANIMATION.startTime = ANIMATION.currentTime(); 
    ANIMATION.timer = setInterval(ANIMATION.draw, ANIMATION.timerInterval);
};