let board;
let boardWidth = 2560;
let boardHeight = 1440;
let context;

// let ghostWidth = 119; //width/height ratio = 408/228 = 17/12
// let ghostHeight = 84;
// let ghostX = boardWidth/3;
// let ghostY = boardHeight/2;
// let ghostImg;

let ghostWidth = 118; 
let ghostHeight = 118;
let ghostX = boardWidth/3;
let ghostY = boardHeight/2;
let ghostImg;


let ghost = {
    x : ghostX,
    y : ghostY,
    width : ghostWidth,
    height : ghostHeight
}


let pipeArray = [];
let pipeWidth = 128; //width/height ratio = 1/8
let pipeHeight = 1024;
let pipeX = boardWidth;
let pipeY = 0;


let topPipeImg;
let bottomPipeImg;

let velocityX = -20;
let velocityY = 0;
let gravity = 0.6;

let gameOver = false;
let score = 0;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    ghostImg = new Image();
    ghostImg.src = "./ghost.png";
    ghostImg.onload = function() {
        context.drawImage(ghostImg, ghost.x, ghost.y, ghost.width, ghost.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1000);
    document.addEventListener("keydown", moveghost);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    velocityY += gravity;
    ghost.y = Math.max(ghost.y + velocityY, 0);
    context.drawImage(ghostImg, ghost.x, ghost.y, ghost.width, ghost.height);

    if (ghost.y > board.height) {
        gameOver = true;
    }

  
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && ghost.x > pipe.x + pipe.width) {
            score += 0.5;
            pipe.passed = true;
        }

        if (detectCollision(ghost, pipe)) {
            gameOver = true;
        }
    }

    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); 
    }

    
    context.fillStyle = "purple"; 
    context.font = "90px sans-serif";
    context.textAlign = "right"; 
    context.fillText(score, board.width - 10, 90);


    if (gameOver) {
        context.fillStyle = "white"; 
        context.font = "300px sans-serif"; 
        context.textAlign = "center"; 
        context.fillText("GAME OVER", board.width / 2, board.height / 2)
    }
    
}

function placePipes() {
    if (gameOver) {
        return;
    }

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

function moveghost(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {

        velocityY = -11;

        if (gameOver) {
            ghost.y = ghostY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   
           a.x + a.width > b.x &&   
           a.y < b.y + b.height &&  
           a.y + a.height > b.y;    
}