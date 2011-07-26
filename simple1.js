ANIMATION = {};

ANIMATION.ball = null;
ANIMATION.startTime = null;
ANIMATION.timer = null;
ANIMATION.timerInterval = 1000 / 30;

ANIMATION.currentTime = function() {
    //getTime() - Returns the number of milliseconds since midnight Jan 1, 1970
    return (new Date).getTime();
};

ANIMATION.draw = function () {
    var step = ANIMATION.currentTime() - ANIMATION.startTime;
    ANIMATION.ball.style.left = step + 'px';
};

ANIMATION.start = function () {
    ANIMATION.ball = document.getElementById('ball');
    ANIMATION.startTime = ANIMATION.currentTime();
    ANIMATION.timer = setInterval(ANIMATION.draw, ANIMATION.timerInterval);
};