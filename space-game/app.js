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
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    const heroImg = await loadTexture('assets/player.png')
    const enemyImg = await loadTexture('assets/enemyShip.png')
    const backgroundImg = await loadTexture('assets/starBackground.png')

    const starBackground = ctx.createPattern(backgroundImg, 'repeat');
    ctx.fillStyle = starBackground;
    ctx.fillRect(0,0, canvas.width, canvas.height);

    ctx.drawImage(heroImg, canvas.width/2 - 45, canvas.height - (canvas.height/4));
    ctx.drawImage(heroImg, canvas.width/2 + 60, canvas.height - (canvas.height/4) + heroImg.height/2, heroImg.width/2, heroImg.height/2);
    ctx.drawImage(heroImg, canvas.width/2 - 100, canvas.height - (canvas.height/4) + heroImg.height/2, heroImg.width/2, heroImg.height/2);

    function createEnemies(ctx, canvas, enemyImg) {
        const MONSTER_TOTAL_low = 5;

        for (let low = 0; low < MONSTER_TOTAL_low; low++) {
            const MONSTER_TOTAL = MONSTER_TOTAL_low-low;
            const MONSTER_WIDTH = MONSTER_TOTAL * enemyImg.width;
            const START_X = (canvas.width - MONSTER_WIDTH) / 2;
            const y = low * enemyImg.height;
            for (let j = 0; j < MONSTER_TOTAL; j++) {
                const x = START_X + j * enemyImg.width;
                ctx.drawImage(enemyImg, x, y);
            }
        }
    }
    createEnemies(ctx, canvas, enemyImg);
};