//board
let tileSize = 32;
let rows = 16;
let columns = 16;

let board;
let boardWidth = tileSize * columns; 
let boardHeight = tileSize * rows; 
let context;

//ship
let shipWidth = tileSize*2;
let shipHeight = tileSize;
let shipX = tileSize * columns/2 - tileSize;
let shipY = tileSize * rows - tileSize*2;

let ship = {
    x : shipX,
    y : shipY,
    width : shipWidth,
    height : shipHeight
}

let shipImg;
let shipVelocityX = tileSize;

// aliens
let alienArray = []
let alienWidth = tileSize*2;
let alienHeight = tileSize;
let alienX = tileSize;
let alienY = tileSize;
let alienImg;


let alienRows = 2;
let alienColumns = 3;
let alienCount = 0; // number of aliens to defear 

// make aliens move
let alienVelocityX = 1;

let bulletArray = [];
let bulletVelocityY = -10;

// score counter
let score = 0;
let gameOver = false;


window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d"); 

    //ship image
    shipImg = new Image();
    shipImg.src = "ship.png";
    shipImg.onload = function() {
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    }

    alienImg = new Image();
    alienImg.src = "alien.png";
    createAliens();

    requestAnimationFrame(update);
    document.addEventListener("keydown", moveShip);
    document.addEventListener("keyup", shoot);
}

function update() {
    requestAnimationFrame(update);

    context.clearRect(0, 0, board.width, board.height); // Clear the entire board

    if (gameOver) {
        // Display "Game Over" message
        context.fillStyle = 'red';
        context.font = '30px courier';
        context.fillText('Game Over', boardWidth / 2 - 80, boardHeight / 2);

        context.fillStyle = 'white';
        context.font = '20px courier';
        const finalScoreText = 'Final Score: ' + score;
        const finalScoreTextWidth = context.measureText(finalScoreText).width;
        context.fillText(finalScoreText, boardWidth / 2 - finalScoreTextWidth / 2, boardHeight / 2 + 30);

        
        return;
    }

    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

    for (let i = 0; i < alienArray.length; i++) {
        let alien = alienArray[i];
        if (alien.alive) {
            alien.x += alienVelocityX;

            // bounds handling 
            if (alien.x + alien.width >= board.width || alien.x <= 0) {
                alienVelocityX *= -1;
                alien.x += alienVelocityX * 2;

                for (let j = 0; j < alienArray.length; j++) {
                    alienArray[j].y += alienHeight;
                }
            }

            context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);

            if (alien.y + alien.height >= ship.y) {
                gameOver = true;
            }
        }
    }

    for (let i = 0; i < bulletArray.length; i++) {
        let bullet = bulletArray[i];
        bullet.y += bulletVelocityY;
        context.fillStyle = 'white';
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // bullets and aliens collide
        for (let j = 0; j < alienArray.length; j++) {
            let alien = alienArray[j];
            if (!bullet.used && alien.alive && detectCollision(bullet, alien)) {
                bullet.used = true;
                alien.alive = false;
                alienCount--;
                score += 100;
            }
        }
    }

    // clear bullet after they're useless
    while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) {
        bulletArray.shift();
    }

    // make more aliens aka more levels
    if (alienCount == 0) {
        // increase no of rows and cols by 1
        alienColumns = Math.min(alienColumns + 1, columns / 2 - 2); // width of each alien = 2 tiles, -2 so that they have place to move around
        // cap at 16/2 - 2 == 6 alien columns

        alienRows = Math.min(alienRows + 1, rows - 4); // cap at 16-4 = 12 alien rows
        alienVelocityX += 0.2 // increase alien movement speed for each level
        alienArray = [];
        bulletArray = []; // to ensure that the new set of aliens do not accidentally touch a pre existing bullet
        createAliens();
    }

    // score counter
    context.fillStyle = "white";
    context.font = "16px courier";
    context.fillText(score, 5, 20);
}



function moveShip(e) {
    if (gameOver) {
        return;
    }


    if (e.code == "ArrowLeft" && ship.x - shipVelocityX >= 0) {
        ship.x -= shipVelocityX; // moving left
    }
    else if (e.code == "ArrowRight" && ship.x + shipVelocityX + ship.width <= board.width) {
        ship.x += shipVelocityX; // moving right
    }
}

function createAliens() {
    for (let c = 0; c < alienColumns; c++) {
        for (let r = 0; r < alienRows; r++) {
            let alien = {
                img: alienImg,
                x: alienX + c*alienWidth,
                y: alienY + r*alienHeight,
                width: alienWidth,
                height: alienHeight,
                alive: true
            }
            alienArray.push(alien);
        }
    }
    alienCount = alienArray.length;
}

function shoot(e) {
    if (gameOver) {
        return;
    }

    if (e.code == "Space") {
        let bullet = {
            x: ship.x + shipWidth*15/32,
            y: ship.y,
            width: tileSize/8,
            height: tileSize/2,
            used: false
        }
        bulletArray.push(bullet);
    }
}

function detectCollision(a,b) {
    return  a.x < b.x + b.width &&  // a does not exceed b's top right corner
            a.x + a.width > b.x &&  // a does not exceed b's top left corner
            a.y < b.y + b.height && // a does not exceed b's bottom left corner
            a.y + a.height > b.y;   // a does not exceed b's bottom right corner

}