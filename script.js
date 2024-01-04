let contenedor = document.createElement("div");
contenedor.classList.add("contenedor");
contenedor.innerHTML = `
    <div id="contador">
        <h1 class="title">PONG</h1>   
    </div>
    <div id="botones">
        <button id="start">Start</button>
    </div>
`;

document.body.appendChild(contenedor);


function events(){
    let start = document.getElementById("start");
    start.addEventListener("click", startGame);
}

events();

const winSound=new Audio('./audio/crowd-cheer-ii-6263.mp3');
const hitSound=new Audio('./audio/laser-gun-72558.mp3');

let context;

let lastUpdateTime = 0;
const frameRate = 60; //fps
let marcador1 = 0;
let marcador2 = 0;

const ballVelo = 6;
const bolaElement = document.querySelector("#bola");
const WIDTH = 800;
const HEIGHT = 500;
let bola = { 
    x:0, y:0,
    direccion:false, //si va a la izq es false si no, true.
    color:"white",
    size:"5px",
    maxAltura:"600px",
    minAltura:"0",
    maxAnho:"1000px",
    minAncho:"0px",
    posicionBolaEjeX :400,
    posicionBolaEjeY : 250,
    velocidadX : ballVelo,
    velocidadY : ballVelo 
};


let playerVelo = 4;
//players
let max = 440;
let min = 10;
let playerWidth = 10;
let playerHeight = 70;
let movement = 10;

let player1 = {
    x : 10,
    y : HEIGHT/2,
    width: playerWidth,
    height: playerHeight,
    velocityY: 0
}

let player2 = {
    x : WIDTH - playerWidth - 10,
    y : HEIGHT/2,
    width: playerWidth,
    height: playerHeight,
    velocityY: 0
}

function startGame(){
    document.body.removeChild(contenedor);
    contenedor.innerHTML=`
    <div id="contador">
        <h1>PONG</h1>   
    </div>
    <div id="resultado"></div>
    <canvas id="myCanvas"></canvas>
    `;
    document.body.appendChild(contenedor);
    let myCanvas = document.getElementById("myCanvas");
    myCanvas.width = WIDTH;
    myCanvas.height = HEIGHT;
    document.addEventListener("keydown", movePlayer);
    document.addEventListener("keyup", stopPlayer);
    requestAnimationFrame(update);
}

function update(time){
    context = myCanvas.getContext("2d");
    let deltaTime = time - lastUpdateTime;
    if (deltaTime > 1000 / frameRate) {
        
        context.clearRect(0, 0, WIDTH, HEIGHT);

        context.font="45px Black Ops One ";
        context.fillText(marcador1, WIDTH/5, 45);
        context.fillText(marcador2, WIDTH*4/5 -45, 45);

        for(let i=0; i < HEIGHT; i+=9){
            context.fillRect(WIDTH/2 - 10, i, 5, 10);
        }
        
        // player1
        context.fillStyle = "black";
        let nextPlayer1Y = player1.y + player1.velocityY;
        if (!outOfBounds(nextPlayer1Y)) {
            player1.y = nextPlayer1Y;
        }
        // player1.y += player1.velocityY;
        context.fillRect(player1.x, player1.y, playerWidth, playerHeight);

        // player2
        let nextPlayer2Y = player2.y + player2.velocityY;
        if (!outOfBounds(nextPlayer2Y)) {
            player2.y = nextPlayer2Y;
        }
        // player2.y += player2.velocityY;
        context.fillRect(player2.x, player2.y, playerWidth, playerHeight);
        
        context.beginPath();
        context.arc(bola.posicionBolaEjeX, bola.posicionBolaEjeY, 10, 0, 2 * Math.PI);
        context.fillStyle = "black";
        context.fill();

        bola.posicionBolaEjeX += bola.velocidadX;
        bola.posicionBolaEjeY += bola.velocidadY;

        if (bola.posicionBolaEjeX == WIDTH +20) {
            bola.posicionBolaEjeX = 400;
            bola.posicionBolaEjeY = 250;
            bola.velocidadX = -ballVelo;
            bola.velocidadY = -ballVelo;
            marcador2 = marcador2 +1;
            winSound.play();
        }

        if (bola.posicionBolaEjeX == -20){
            bola.posicionBolaEjeX = 400;
            bola.posicionBolaEjeY = 250;
            bola.velocidadX = ballVelo;
            bola.velocidadY = ballVelo;
            marcador1 = marcador1 +1;
            winSound.play();
        }

        if(bola.posicionBolaEjeY >= player1.y && bola.posicionBolaEjeY <= player1.y + playerHeight && bola.posicionBolaEjeX < player1.x + 15){
            //bolay vale 50 yplayer 100
            bola.velocidadX = ballVelo;
            hitSound.play();
        }
        if(bola.posicionBolaEjeY >= player2.y && bola.posicionBolaEjeY <= player2.y + playerHeight && bola.posicionBolaEjeX > player2.x - 8){
            bola.velocidadX = -ballVelo;
            hitSound.play();
        }

        if (bola.posicionBolaEjeY + 10 == HEIGHT || bola.posicionBolaEjeY - 10 == 0) {
            bola.velocidadY = -bola.velocidadY;
            hitSound.play();
        }
        lastUpdateTime = time;
    }

    if(marcador1 == 5 || marcador2 == 5){
        winORlosse();
    }else{
        requestAnimationFrame(update);
    }
}

function outOfBounds(yPosition) {
    return (yPosition < 0 || yPosition + playerHeight > HEIGHT);
}

function movePlayer(e) {
    //player1 movement up
    if (e.code == "KeyW") {
        if(player1.y > min){
            player1.velocityY = -playerVelo;
        }
    }
    //player1 movement down
    if (e.code == "KeyS") {
        if(player1.y < (max)){
            player1.velocityY = playerVelo;
        }
    }

    //player2 mevement up
    if (e.code == "ArrowUp") {
        if(player2.y > min){
            player2.velocityY = -playerVelo;
        }
    }
    //player2 mevement down
    if (e.code == "ArrowDown") {
        if(player2.y < max){
            player2.velocityY = playerVelo;
        }
    }

}

function stopPlayer(e){
    if (e.code == "KeyW") {
        if(player1.y > min){
            player1.velocityY = 0;
        }
    }
    if (e.code == "KeyS") {
        if(player1.y < (max)){
            player1.velocityY = 0;
        }
    }

    if (e.code == "ArrowUp") {
        if(player2.y > min){
            player2.velocityY = 0;
        }
    }
    if (e.code == "ArrowDown") {
        if(player2.y < max){
            player2.velocityY = 0;
        }
    }
}

function winORlosse(){
    let ganador;
    if (marcador1 == 5){
        ganador = 2;
    }
    if (marcador2 == 5){
        ganador = 1;
    }

    marcador1 = 0;
    marcador2 = 0;

    player1.y = HEIGHT/2;
    player2.y = HEIGHT/2;
    
    document.body.removeChild(contenedor);
    contenedor.innerHTML = `
    <div id="contador">
        <h1 class="title">PONG</h1>
        <h1 class="mensaje" style="Black Ops One">Ha ganado el jugador ${ganador}.</h1>
    </div>
    <div id="botones">
        <button id="start">Restart</button>
    </div>
    `;
    document.body.appendChild(contenedor);
    events();
}