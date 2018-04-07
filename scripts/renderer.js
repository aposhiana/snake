MyGame.renderer = (function(gameState) {
    'use strict';

    const B_LEN = 20;
    const OBSTACLE_COLOR = '#7FFF00';
    const FOOD_COLOR = 'orange';
    const SNAKE_COLOR = 'white';

    function drawBlock(x, y, color, context) {
        let startX = x * B_LEN;
        let startY = y * B_LEN;
        context.beginPath();
        context.strokeStyle = color;
        context.lineWidth = 1;
        context.moveTo(startX, startY);
        context.lineTo(startX + B_LEN, startY);
        context.lineTo(startX + B_LEN, startY + B_LEN);
        context.lineTo(startX, startY + B_LEN);
        context.closePath();
        context.fillStyle = color;
        context.fill();
        context.stroke();
    }

    function render(context, elapsedTime) {
        context.clear();

        // Draw background
        context.beginPath();
        context.strokeStyle = 'blue';
        context.lineWidth = 1;
        context.moveTo(0, 0);
        context.lineTo(1000, 0);
        context.lineTo(1000, 1000);
        context.lineTo(0, 1000);
        context.closePath();
        context.fillStyle = 'blue';
        context.fill();
        context.stroke();

        // Draw outer walls
        context.beginPath();
        context.strokeStyle = '#1e1e1e';
        context.lineWidth = 20;
        context.moveTo(10, 990);
        context.lineTo(10, 10);
        context.lineTo(990, 10);
        context.lineTo(990, 990);
        context.closePath();
        context.stroke();

        // Draw obstacles
        for (let i = 0; i < gameState.obstacles.length; i++) {
            let obY = gameState.obstacles[i].y;
            let obX = gameState.obstacles[i].x;
            drawBlock(obX, obY, OBSTACLE_COLOR, context);
        }

        // Draw food
        if (gameState.food.x !== null) {
            let foodX = gameState.food.x;
            let foodY = gameState.food.y;
            drawBlock(foodX, foodY, FOOD_COLOR, context);
        }

        // Draw snake
        for (let i = 0; i < gameState.snake.length; i++) {
            let snakeY = gameState.snake[i].y;
            let snakeX = gameState.snake[i].x;
            drawBlock(snakeX, snakeY, SNAKE_COLOR, context);
        }

        // Render GAME OVER if in gameover
        if (gameState.getState() === 'gameover') {
            context.save();
            context.translate(0,0);
            context.font = 'bold 120px sans-serif';
            context.fillStyle = 'black';
            context.shadowColor = 'darkslategrey';
            context.shadowOffsetX = 0;
            context.shadowOffsetY = 0;
            context.shadowBlur = 10;
            let halfTextWidth = context.measureText('GAME OVER').width / 2;
            context.fillText('GAME OVER', 500 - halfTextWidth, 525);
            context.font = 'bold 42px sans-serif';
            halfTextWidth = context.measureText('press ESC to exit').width / 2;
            context.fillText('press ESC to exit', 500 - halfTextWidth, 620);
            context.restore();
        }
    }

    return {
        render
    };
}(MyGame.gameState));