var menuButtons;

var background;
var backgroundWidth;
var bgImages;
var movementPos;

var pipes;

var started;

var pipeMin = -85; //Up
var pipeMax = -35; //Down
var pipeGap;

var speed; //ms
var offset;

var player;

var gravityAcc;
var gravityOn;
var gravitySpeed;

var jumpSpeed;
var curJumpSpeed

var clicked;
var flying;

var points;
var pointAdded;
var pointBase = "https://github.com/sourabhv/FlapPyBird/blob/master/assets/sprites/";

window.onload = function() {

    init();

    $("#menu").click(function() {
         $(this).hide();
         start();
    })
    $("#control").click(function(event) {
        if(started) {
            event.stopPropagation(); 
            event.preventDefault();
            clicked = true;
        }
    });

    $("#gameOver").click(function() {
        player.remove();
        initReady = false;
        init();
        $("#menu").show();
        $(this).hide();
    })

};

function init() {
    speed = 0.5;
    started = false;
    movementPos = 0;
    offset = 0.15;
    gravityAcc = 0.0085;
    gravityAcc = $(window).width() / 100 * gravityAcc;
    gravitySpeed = gravityAcc;
    pipeGap = 24;
    gravityOn = true;
    clicked = false;
    flying = false;
    jumpSpeed = 0.38;
    jumpSpeed = $(window).width() / 100 * jumpSpeed;
    curJumpSpeed = jumpSpeed;
    points = 0;
    pointAdded = false;

    $(".background").empty();
    $(".background").css({
        width: backgroundWidth + "px",
        left: 0 + "px"
    });

    pipeGap = $(window).width() / 100 * pipeGap;
    pipeGap = pipeGap * 100 / $(window).height();
    offset = $(window).width() / 100 * offset;
    menuButtons = $("#menuButtons");
    if(($(document).width() < 500) || ($(document).height() < 500)) {
        menuButtons.css({
            height: "80%",
            width: "80%"
        })
    }

    background = $(".background");
    backgroundWidth = background.width();

    var pipe = random(pipeMin, pipeMax);
    var layout = '<div style="width: ' + backgroundWidth + 'px">';
    layout += '<div class="pipe top" style="top: ' + pipe + '%"></div>';
    layout += '<div class="pipe bottom" style="bottom: -' + ((pipe + pipeGap) + 100) + '%"></div>';
    layout += '</div>';
    background.append(layout);
    background.css({
        width: backgroundWidth
    });
    bgImages = $(".background > div");
    pipes = $(".background .pipe");
    createPlayer();
    $(".game > .points").html('<div><img src="' + pointBase + points + '.png?raw=true"></div>');
    displayPoints();
    initReady = true;
}

function start() {
    player.fadeIn();
    setTimeout(function() {
        started = true;
        movement(speed);
    }, 1000);
}

function gravity() {
    if(gravityOn) {
        player.css({
            top: player.offset().top + gravitySpeed
        })
        gravitySpeed += gravityAcc;

    } else {
        gravitySpeed = gravityAcc;
    }
}

function playerMovement() {
    player = $("#player");

    if(player.offset().top > $(window).height()) { //Fell out of world
        gameOver();
        player.remove();
        return;
    }

    if(pipes.length > 2) { //Pipe collapse
        var pipeTop = pipes[pipes.length - 4];
        var pipeBottom = pipes[pipes.length - 3];
        var pipeGapPx = $(window).height() / 100 * pipeGap;
        if(($(pipeTop).offset().left <= player.offset().left + player.width()) && (player.offset().left <= $(pipeTop).offset().left + $(pipeTop).width())) {
            if(($(pipeBottom).offset().top <= player.offset().top + player.height()) || ($(pipeBottom).offset().top - pipeGapPx) >= player.offset().top) {
                gameOver();
                return;
            }
            if(($(pipeTop).offset().left + ($(pipeTop).width() / 1.2) <= player.offset().left) && (pointAdded == false)) {
                pointAdded = true;
                points++
                offset += 0.1;
                displayPoints();
            }
        }
    }

    if(clicked) { //Jump / Fly
        flying = true;
        clicked = false;
        curJumpSpeed = jumpSpeed;
    }
    if(flying) {
        gravityOn = false;
        player.css({
            top: player.offset().top - curJumpSpeed + "px"
        })
        curJumpSpeed -= gravityAcc;
        if(jumpSpeed <= 0) {
            curJumpSpeed = jumpSpeed;
            gravityOn = true;
            flying = false;
        }
    }
}

function gameOver() {
    started = false;
    $(".game > .points").empty();
    $("#gameOver").fadeIn()
}

function movement(s) { //Everything that moves. Functions that needs to be called once in every fps.

    setTimeout(function() {

        if(started == true) {
            world();
            gravity();
            playerMovement();
            movementPos -= offset;
            background.css({
                "left": movementPos + "px"
            })
            movement(speed);
        }

    }, s);

}

function createPlayer() {
    $(".game").append('<div class="player" id="player"><img src="https://github.com/sourabhv/FlapPyBird/blob/master/assets/sprites/bluebird-midflap.png?raw=true"></div>')
    player = $("#player");
}

function world() {

    if($(bgImages[bgImages.length - 1]).offset().left <= 0) {
        background.css({
            width: "+=" + backgroundWidth
        });
        var layout = '<div style="width: ' + backgroundWidth + 'px">';
        if(bgImages.length > 0) {
            var pipe = random(pipeMin, pipeMax);
            layout += '<div class="pipe top" style="top: ' + pipe + '%"></div>';
            layout += '<div class="pipe bottom" style="bottom: -' + ((pipe + pipeGap) + 100) + '%"></div>';
        }
        layout += '</div>';
        background.append(layout);
        bgImages = $(".background > div");
        pipes = $(".background .pipe");
        pointAdded = false;

    }

}

function displayPoints() {
    var string = points.toString();
    var length = string.length;
    $(".points").empty();

    for(var a = 0; a < length; a++) {
        $(".points").append('<div><img src="' + pointBase + string[a] + '.png?raw=true"></div>');
    }


}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function audio(name) {

    var a;
    switch(name) {
        case "die":
            a = "https://raw.githubusercontent.com/V-Play/FlappyBird/master/assets/audio/sfx_die.wav"
            break;
        case "hit":
            a = "https://raw.githubusercontent.com/V-Play/FlappyBird/master/assets/audio/sfx_hit.wav"
            break;
        case "point":
            a = "https://raw.githubusercontent.com/V-Play/FlappyBird/master/assets/audio/sfx_point.wav"
            break;
        case "jump":
            a = "https://raw.githubusercontent.com/V-Play/FlappyBird/master/assets/audio/sfx_wing.wav"
            break;
    }
    a = new Audio(a);
    a.loop = false;
    a.play();

}