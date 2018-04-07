MyGame.renderer = (function(gameState) {
    'use strict';

    // Hard coded strings to sources of images - initialize changes these to actual images
    // let images = {
    //     backgroundImg: 'images/mountain-clouds.jpg'
    // };

    function render(context, elapsedTime) {
        context.clear();

        // if (images.backgroundImg.isReady) {
	    // 	context.drawImage(images.backgroundImg, 0, 0, 1000, 1000);
        // }

        // Draw outer walls
        context.beginPath();
        context.strokeStyle = '#1e1e1e';
        context.lineWidth = 10;
        context.moveTo(5, 1000);
        context.lineTo(5, 5);
        context.lineTo(995, 5);
        context.lineTo(995, 1000);
        context.stroke();

        // Render score
        context.font = '20px sans-serif';
        context.fillStyle = '#ccff15';
        context.fillText('Score: ' + gameState.getScore(), 880, 985);

        // Render countdown if in countdown
        if (gameState.getState() === 'countdown') {
            let countValue = gameState.getCountdown();
            if (countValue > 0) {
                context.font = '200px sans-serif';
                context.fillStyle = 'black';
                let halfTextWidth = context.measureText(countValue).width / 2;
                context.fillText(countValue, 500 - halfTextWidth, 560);
            }  
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
        render,
        // images
    };
}(MyGame.gameState));