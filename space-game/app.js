function loadTexture(path) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = path;
        img.onload = () => {
        resolve(img);
    };
 })
}

window.onload = async() => {
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext("2d");
    
    heroImg = await loadTexture('assets/player.png');
    enemyImg = await loadTexture('assets/enemyShip.png');
    laserImg = await loadTexture('assets/laserRed.png');
    boomImg = await loadTexture('assets/laserRedShot.png');

    initGame();
    let gameLoopId = setInterval(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawGameObjects(ctx);
        updateGameObjects();
    }, 100)

};

function createEnemies() {
    const MONSTER_TOTAL = 5;
    const MONSTER_WIDTH = MONSTER_TOTAL * 98;
    const START_X = (canvas.width - MONSTER_WIDTH) / 2;
    const STOP_X = START_X + MONSTER_WIDTH;

    for (let x = START_X; x < STOP_X; x += 98) {
        for (let y = 0; y < 50 * 5; y += 50) {
            const enemy = new Enemy(x, y);
            enemy.img = enemyImg;
            gameObjects.push(enemy);
        }
    }
}

function createHero() {
    hero = new Hero(
        canvas.width / 2 - 45,
        canvas.height - canvas.height / 4
    );
    hero.img = heroImg;
    gameObjects.push(hero);

    leftHero = new SubHero(hero.x - 60, hero.y + 20);
    gameObjects.push(leftHero);

    rightHero = new SubHero(hero.x + 110, hero.y + 20);
    gameObjects.push(rightHero);
}

function drawGameObjects(ctx) {
    gameObjects.forEach(go => go.draw(ctx));
}

let gameLoopId = setInterval(() => {
    // 화면 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 게임 객체 그리기
    //drawHero(); // 플레이어 캐릭터
    //drawEnemies(); // 적들
    //drawStaticObjects(); // 배경과 같은 정적인 요소
}, 200);

class GameObject {
    constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dead = false; // 객체가 파괴되었는지 여부
    this.type = ""; // 객체 타입 (영웅/적)
    this.width = 0; // 객체의 폭
    this.height = 0; // 객체의 높이
    this.img = undefined; // 객체의 이미지
    }

    rectFromGameObject() {
        return {
        top: this.y,
        left: this.x,
        bottom: this.y + this.height,
        right: this.x + this.width,
        };
    }

    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height); //캔버스에 이미지 그리기
    }
}

class Hero extends GameObject {
    constructor(x, y) {
        super(x, y);
        (this.width = 99), (this.height = 75);
        this.type = 'Hero';
        this.speed = { x: 0, y: 0 };
        this.cooldown = 0;
    }
    fire() {
        if (this.canFire()) {
            gameObjects.push(new Laser(this.x + 45, this.y - 10)); // 레이저 발사
            this.cooldown = 500; // 쿨다운 500ms
            let id = setInterval(() => {
                if (this.cooldown > 0) {
                    this.cooldown -= 100;
                } else {
                    clearInterval(id);
                }
            }, 100);
        }
    }
    canFire() {
        return this.cooldown === 0; // 쿨다운이 끝났는지 확인
    }
}

class SubHero extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 50;
        this.height = 37;
        this.type = "SubHero";
        this.img = heroImg;

        this.fireInterval = setInterval(() => {
            gameObjects.push(new Laser(this.x + 20, this.y - 10)); // 서브 히어로 레이저 발사
        }, 1000); // 1초마다 발사
    }
}

class Enemy extends GameObject {
    constructor(x, y) {
        super(x, y);
        this.width = 98;
        this.height = 50;
        this.type = "Enemy";
        // 적 캐릭터의 자동 이동 (Y축 방향)
        let id = setInterval(() => {
            if (this.y < canvas.height - this.height) {
                this.y += 5; // 아래로 이동
            } else {
                console.log('Stopped at', this.y);
                clearInterval(id); // 화면 끝에 도달하면 정지
            }
        }, 300);
    }
}

let onKeyDown = function (e) {
        console.log(e.keyCode); // 눌린 키의 keyCode를 출력
        switch (e.keyCode) {
            case 37: // 왼쪽 화살표
            case 38: // 위쪽 화살표
            case 39: // 오른쪽 화살표
            case 40: // 아래쪽 화살표
            case 32: // 스페이스바
                e.preventDefault(); // 기본 동작 차 단
                break;
            default:
                break; // 다른 키는 기본 동작 유지
        }
    };
window.addEventListener("keydown", onKeyDown);

window.addEventListener("keyup", (evt) => {
    
    if (evt.key === "ArrowUp") {
        eventEmitter.emit(Messages.KEY_EVENT_UP);
    } else if (evt.key === "ArrowDown") {
        eventEmitter.emit(Messages.KEY_EVENT_DOWN);
    } else if (evt.key === "ArrowLeft") {
        eventEmitter.emit(Messages.KEY_EVENT_LEFT);
    } else if (evt.key === "ArrowRight") {
        eventEmitter.emit(Messages.KEY_EVENT_RIGHT);
    } else if (evt.keyCode === 32) { // 스페이스바
    eventEmitter.emit(Messages.KEY_EVENT_SPACE);
    }
});

class EventEmitter {
    constructor() {
        this.listeners = {};
    }
    on(message, listener) {
        if (!this.listeners[message]) {
            this.listeners[message] = [];
        }
        this.listeners[message].push(listener);
    }
    emit(message, payload = null) {
        if (this.listeners[message]) {
            this.listeners[message].forEach((l) => l(message, payload));
        }
    }
}

const Messages = {
    KEY_EVENT_UP: "KEY_EVENT_UP",
    KEY_EVENT_DOWN: "KEY_EVENT_DOWN",
    KEY_EVENT_LEFT: "KEY_EVENT_LEFT",
    KEY_EVENT_RIGHT: "KEY_EVENT_RIGHT",
    KEY_EVENT_SPACE: "KEY_EVENT_SPACE",
    COLLISION_ENEMY_LASER: "COLLISION_ENEMY_LASER",
    COLLISION_ENEMY_HERO: "COLLISION_ENEMY_HERO",
};

let heroImg,
 enemyImg,
 laserImg,
 boomImg,
 canvas, ctx,
 gameObjects = [],
 hero,
 eventEmitter = new EventEmitter();

function initGame() {
    gameObjects = [];
    createEnemies();
    createHero();

    eventEmitter.on(Messages.KEY_EVENT_UP, () => {
        hero.y -=5 ;
        leftHero.y -=5 ;
        rightHero.y -=5 ;
    })

    eventEmitter.on(Messages.KEY_EVENT_DOWN, () => {
        hero.y += 5;
        leftHero.y += 5;
        rightHero.y += 5;
    });

    eventEmitter.on(Messages.KEY_EVENT_LEFT, () => {
        hero.x -= 5;
        leftHero.x -= 5;
        rightHero.x -= 5;
    });

    eventEmitter.on(Messages.KEY_EVENT_RIGHT, () => {
        hero.x += 5;
        leftHero.x += 5;
        rightHero.x += 5;
    });

    eventEmitter.on(Messages.KEY_EVENT_SPACE, () => {
        if (hero.canFire()) {
            hero.fire();
        }
    });

    eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {
        first.dead = true;
        second.dead = true;

        const explosion = new boom(second.x, second.y);
        gameObjects.push(explosion);
    });
}

function intersectRect(r1, r2) {
    return !(
    r2.left > r1.right ||
    r2.right < r1.left ||
    r2.top > r1.bottom ||
    r2.bottom < r1.top
    );
}

class Laser extends GameObject {
    constructor(x, y) {
        super(x, y);
        (this.width = 9), (this.height = 33);
        this.type = 'Laser';
        this.img = laserImg;
        let id = setInterval(() => {
            if (this.y > 0) {
                this.y -= 15; // 레이저가 위로 이동
            } else {
                this.dead = true; // 화면 상단에 도달하면 제거
                clearInterval(id);
            }
        }, 100);
    }
}

class boom extends GameObject {
    constructor(x, y) {
        super(x, y);
        (this.width = 80), (this.height = 80);
        this.type = 'boom';
        this.img = boomImg;
        setTimeout(() => {
            this.dead = true; // 폭발 애니메이션 후 제거
        }, 300);
    }
}

eventEmitter.on(Messages.COLLISION_ENEMY_LASER, (_, { first, second }) => {
    first.dead = true; // 레이저 제거
    second.dead = true; // 적 제거
});

function updateGameObjects() {
    const enemies = gameObjects.filter(go => go.type === 'Enemy');
    const lasers = gameObjects.filter((go) => go.type === "Laser");

    lasers.forEach((l) => {
        enemies.forEach((m) => {
            if (intersectRect(l.rectFromGameObject(), m.rectFromGameObject())) {
                eventEmitter.emit(Messages.COLLISION_ENEMY_LASER, {
                    first: l,
                    second: m,
                });
            }
        });
    });
    // 죽은 객체 제거
    gameObjects = gameObjects.filter(go => !go.dead);
}