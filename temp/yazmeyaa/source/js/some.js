//by yazmeyaa
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function rand(mn, mx){
    return Math.floor(mn + Math.random() * (mx - mn + 1));
    };

function percent(value, percent){
        return (value / 100) * percent;
    };

    function vect(Ax,Bx) {
        return Ax-Bx;
    };
    
    
    function vectLength(a,b) {
        return Math.sqrt(a ** 2 + b ** 2);
    };
//Tophead

let mouse = {
    x : 0,
    y : 0,
};

const score = {
points : 0,
render: function () {
    ctx.fillStyle = 'white';
    ctx.font = '24px Gouranga';
    ctx.fillText(`SCORE IS: ${this.points}.`, canvas.width / 2, percent(canvas.height, 10));
},

}



const enemies = [];

const player = {
    x : canvas.width / 2,
    y : canvas.height / 2,
    render : function() {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = "yellow";
        ctx.fill();
        ctx.stroke();
    },
    update : function(dt) {
        if(keys['KeyA'] && this.x > 11){
            this.x -= 400 * dt;
        };
        if(keys['KeyD'] && this.x < canvas.width - 11){
            this.x += 400 * dt;
        }
        if(keys['KeyW'] && this.y > 11){
            this.y -= 400 * dt;
        }
        if(keys['KeyS'] && this.y < canvas.height - 11){
            this.y += 400 * dt;
        }
    }
};

let enemyTimer = 0;

const bullets = [];

let keys = [];

let startGame = false;

let startBullet = false;

let bulletTimer = 0;

let last = Date.now();

let isOver = false;


function restart() {
    isOver = false;
    score.points = 0;
    player.x = canvas.width / 2;
    player.y = canvas.height / 2;
    play();
enemies.splice(0, enemies.length);
bullets.splice(0, bullets.length);
}

addEventListener('keydown', function(event) {
    keys[event.code] = true;
    if(keys['KeyR']){
        restart();
    };
});


addEventListener('keyup', function(event) {
    keys[event.code] = false;
});


addEventListener('pointerdown', function(event) {
    mouse.x = event.layerX;
    mouse.y = event.layerY;
    if(bulletTimer == 0){
        startBullet = true;
    bullets.push(new bullet);
    };

});

addEventListener('pointerpressed', function(event) {
    mouse.x = event.layerX;
    mouse.y = event.layerY;
    if(bulletTimer == 0){
        startBullet = true;
    bullets.push(new bullet);
    };

});

class bullet{
    constructor(){
        this.x = player.x;
        this.y = player.y;
        this.vectX = vect(this.x, mouse.x);
        this.vectY = vect(this.y, mouse.y);
        this.vectLength = vectLength(this.vectX, this.vectY);
        this.vectNormalX = this.vectX / this.vectLength;
        this.vectNormalY = this.vectY / this.vectLength;
    };
    render(){
        ctx.strokeStyle = "white";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = "white";
        ctx.fill();
        ctx.stroke();
    };
    update(dt){
        this.x -= this.vectNormalX * (dt * 1800);
        this.y -= this.vectNormalY * (dt * 1800);
    };
};

class enemy{
    constructor(dt){
        this.x = rand(0, canvas.width);
        this. y = rand(0, canvas.height);
        this.x1;
        this.y1;
        this.speed = rand(350, 700);
        this.vectX;
        this.vectY;
        this.vectLength;
    };

    render(){
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.stroke();
    };
    
    update(dt){
        this.vectX = vect(this.x, player.x);
        this.vectY = vect(this.y, player.y);
        this.vectLength = vectLength(this.vectX, this.vectY);
        this.x -= (this.speed * dt) * (this.vectX / this.vectLength);
        this.y -= (this.speed * dt) * (this.vectY / this.vectLength);
    };
};


function gameOver() {
    for(i = 0; i < enemies.length; i++){
            if((enemies[i].x > player.x - 20 && enemies[i].x < player.x + 20 ) 
            &&
             (enemies[i].y > player.y - 20 && enemies[i].y < player.y + 20)){
                ctx.fillStyle = "black";
                ctx.fillRect(0,0, canvas.width, canvas.height);
                ctx.fillStyle = 'white';
                ctx.font = '24px Gouranga';
                ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
                isOver = true;
                console.log('isOver:', isOver);
            }
        }
}

function clear(){
    ctx.fillStyle = "black";
    ctx.fillRect(0,0, canvas.width, canvas.height);
};


function update(dt) {
    timers(dt);
    player.update(dt);
    for(i = 0; i < bullets.length; i++){
        if(bullets[i]){
        bullets[i].update(dt);
            if(bullets[i].x < 0 ||
                bullets[i].x > canvas.width ||
                bullets[i].y < 0 ||
                bullets[i].y > canvas.height){
                    bullets.splice(i, 1);
                };
            };
    };
    destroy();
    gameOver();
};

function destroy(){
    for(i = 0; i < bullets.length; i++){
        for(j = 0; j < enemies.length; j++){
            if(enemies[i] && bullets[i]){
                if((bullets[i].x > enemies[j].x - 20 && bullets[i].x < enemies[j].x + 20)
                &&
                (bullets[i].y > enemies[j].y - 20 && bullets[i].y < enemies[j].y + 20)){
                    enemies.splice(j, 1);
                    bullets.splice(i, 1);
                    score.points++;
                }
            }
        }
    }
}


function render() {
    clear();
    player.render();
    for(i = 0; i < enemies.length; i++){
    enemies[i].render();
    }

    for(i = 0; i < bullets.length; i++){
        if(bullets[i]){
        bullets[i].render();
        };
    };

    score.render();
};

function timers(delta){

    for(i = 0; i < enemies.length; i++){
        enemies[i].update(delta); 
    };
    if (enemyTimer >= 0.5 && enemies.length < 5){
        enemies.push(new enemy);
        enemyTimer = 0;
    };
    enemyTimer += delta;

    if(startBullet){
        bulletTimer += delta;
        if(bulletTimer >= 0.1){
            bulletTimer = 0;
            startBullet = false;
        };
    };

};


    let audio = new Audio('source/sounds/main.mp3');
    audio.volume = 0.3;
    setTimeout(function(){
        audio.play();
    }, 3000);


function play(){
    let now = Date.now();
    update((now-last)/1000);
    render();
    last = now;
    cancelAnimationFrame(play);
        if(!isOver){
        requestAnimationFrame(play);
        }
    };

    ctx.fillStyle = "black";
    ctx.fillRect(0,0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '24px Gouranga';
    ctx.fillText('Press "R" to start...', canvas.width / 2, canvas.height / 2);