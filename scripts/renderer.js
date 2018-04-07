MyGame.renderer = (function(gameState) {
    'use strict';

    const B_LEN = 20;

    function render(context, elapsedTime) {
        context.clear();

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

        // Render score
        context.font = '20px sans-serif';
        context.fillStyle = '#ccff15';
        context.fillText('Score: ' + gameState.getScore(), 880, 985);

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