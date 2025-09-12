import React, { useRef, useEffect, useState } from 'react';

function GameComponent() {
    const canvasRef = useRef(null);
    const [score, setScore] = useState(0);

    const gameState = useRef({
        boyX: 40, boyY: 150, boyVelY: 0, onGround: true,
        coins: [], spawnTimer: 0, spacePressed: false,
    });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        const WIDTH = 300;
        const HEIGHT = 200;
        canvas.width = WIDTH;
        canvas.height = HEIGHT;

        const GROUND_HEIGHT = 20;
        const gravity = 0.8;

        const boyImg = new Image();
        boyImg.src = "/boy.png";
        const coinImg = new Image();
        coinImg.src = "/coin.png";
        
        const handleKeyDown = (e) => {
            if (e.code === "Space") {
                e.preventDefault(); 
                gameState.current.spacePressed = true;
            }
        };
        window.addEventListener("keydown", handleKeyDown);

        let animationFrameId;

        const update = () => {
            let gs = gameState.current;

            if (gs.spacePressed && gs.onGround) {
                gs.boyVelY = -8;
                gs.onGround = false;
            }
            gs.spacePressed = false;

            gs.boyVelY += gravity;
            gs.boyY += gs.boyVelY;
            if (gs.boyY >= HEIGHT - 40) {
                gs.boyY = HEIGHT - 40;
                gs.boyVelY = 0;
                gs.onGround = true;
            }

            gs.spawnTimer++;
            if (gs.spawnTimer > 60) {
                gs.coins.push({ x: WIDTH, y: Math.floor(Math.random() * (HEIGHT - 110)) + 50 });
                gs.spawnTimer = 0;
            }

            for (let c of gs.coins) c.x -= 3;

            let scoreGained = 0;
            gs.coins = gs.coins.filter(c => {
                if (gs.boyX < c.x + 15 && gs.boyX + 45 > c.x && gs.boyY < c.y + 15 && gs.boyY + 30 > c.y) {
                    scoreGained++;
                    return false;
                }
                return c.x >= -15;
            });
            if (scoreGained > 0) {
                setScore(prevScore => prevScore + scoreGained);
            }
        };

        const draw = () => {
            let gs = gameState.current;
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            ctx.fillStyle = "skyblue";
            ctx.fillRect(0, 0, WIDTH, HEIGHT);
            ctx.fillStyle = "rgb(60,40,20)";
            ctx.fillRect(0, HEIGHT - GROUND_HEIGHT, WIDTH, GROUND_HEIGHT);

            ctx.drawImage(boyImg, gs.boyX, gs.boyY, 45, 30);
            for (let c of gs.coins) {
                ctx.drawImage(coinImg, c.x, c.y, 15, 15);
            }
            ctx.fillStyle = "#ffffff";
            ctx.font = "18px Arial";
            ctx.fillText(`Score: ${score}`, 10, 25);
        };

        const gameLoop = () => {
            update();
            draw();
            animationFrameId = requestAnimationFrame(gameLoop);
        };

        Promise.all([ boyImg.decode(), coinImg.decode() ]).then(gameLoop);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            cancelAnimationFrame(animationFrameId);
        };
    }, [score]);

    return (
        <div>
            <h2>Minigame: Collect Medkits!</h2>
            <p style={{marginBottom: '0.5rem'}}>Press the <strong style={{color: '#667eea'}}>Spacebar</strong> to jump.</p>
            <div style={{
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                width: '100%', overflow: 'hidden', borderRadius: '8px',
                backgroundColor: 'skyblue',
            }}>
                <canvas ref={canvasRef} style={{ display: 'block' }} />
            </div>
        </div>
    );
}

export default GameComponent;