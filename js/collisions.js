import Ball from "./ball.js"

export default class Collider {
    ballWall(ball, gameContainerWidth) {
        if (ball.x <= 0) {
            ball.x = 0;
            ball.dx = Math.abs(ball.dx);
            console.log(`Collision:(${Math.round(ball.x)}, ${Math.round(ball.y)}) - Left Wall`);
        }
        else if (ball.x >= gameContainerWidth-ball.diameter) {
            ball.x = gameContainerWidth-ball.diameter;
            ball.dx = -Math.abs(ball.dx);
            console.log(`Collision:(${Math.round(ball.x)}, ${Math.round(ball.y)}) - Right Wall`);
        }
        if (ball.y <= 0) {
            ball.y = 0;
            ball.dy = Math.abs(ball.dy);
            console.log(`Collision:(${Math.round(ball.x)}, ${Math.round(ball.y)}) - Top Wall`);
        }
    }

    ballPaddle(ball, paddle) {
        const bxEnd = ball.x + ball.diameter;
        const byEnd = ball.y + ball.diameter;
        const pxEnd = paddle.x + paddle.width;
        if (bxEnd < paddle.x || pxEnd < ball.x) {
            return
        } 
        if (byEnd >= paddle.y && byEnd <= paddle.y + paddle.height/2) {
            ball.y = paddle.y - ball.diameter;
            const angle = calculateAngle(ball, paddle);
            ball.dx = Ball.speed * Math.sin(angle);
            ball.dy = -Ball.speed * Math.cos(angle);
            console.log(`Collision:(${Math.round(ball.x)}, ${Math.round(ball.y)}) - Paddle\nAngle: ${Math.round(angle*180/Math.PI)} DEG`);
        }
    }

    ballBrick(ball, brick) {
        if (brick.active && ball.x+ball.diameter >= brick.x && ball.x <= brick.x+brick.width && ball.y+ball.diameter >= brick.y && ball.y <= brick.y+brick.height) {
            // console.log(`Ball-Brick ${Math.floor(ball.x)}, ${Math.floor(ball.y)}`);
            calculateBallBrickCollision(ball, brick);
            brick.active = false;
            // score += 100;
            // htmlScore.innerText = `Score: ${score}`;
            console.log(`Collision:(${Math.round(ball.x)}, ${Math.round(ball.y)}) - Brick`);
            return true;
        }
        return false;
    }
}

function calculateBallBrickCollision(ball, brick) {
    while (ball.x+ball.diameter >= brick.x && ball.x <= brick.x+brick.width && ball.y+ball.diameter >= brick.y && ball.y <= brick.y+brick.height) {
        ball.x -= ball.dx/Ball.speed;
        ball.y -= ball.dy/Ball.speed;
        // console.log(`Rewinding... (${ball.x}, ${ball.y})`);
    }
    if (ball.x+ball.diameter < brick.x || ball.x > brick.x+brick.width) {
        ball.dx = -ball.dx;
    }
    if (ball.y+ball.diameter < brick.y || ball.y > brick.y+brick.height) {
        ball.dy = -ball.dy;
    }
    
}

function calculateAngle(ball, paddle) {
    const norm = paddle.width / 2;
    const bxCentre = ball.x + ball.diameter / 2;
    const pxCentre = paddle.x + norm;
    const result = (bxCentre - pxCentre) / norm;
    // console.log(`Collision Angle: ${result}`);
    return result;
}