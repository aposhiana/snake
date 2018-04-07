MyGame.screens['game-play'] = (function(game, input, gameState, renderer) {
    'use strict';

    const MOVE_INTERVAL = 150;

    let props = {
        lastTimeStamp: null,
        cancelNextRequest: false,
        canvas: null,
        context: null,
        update: gamePlayUpdate,
        accumulatingMoveInterval: 0,
    };

    let keyboard = input.Keyboard();
    let mouse = input.Mouse();

    let stateChanges = {
        moveDirection: null
    };

    function updateHighScores(myScore) {
        let highScores = localStorage.getItem('mini_game.highScores');
        if (highScores !== null) {
            highScores = JSON.parse(highScores);
        }
        else {
            highScores = [];
        }


        // Source for use of this function: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
        function compareNumbers(a, b) {
            return a - b;
        }

        highScores.push(myScore);
        highScores.sort(compareNumbers);
        highScores.reverse();

        for (let i = 5; i < highScores.length; i++) {
            highScores.pop();
        }

        localStorage['mini_game.highScores'] = JSON.stringify(highScores);
    }

    function startNewGame() {
        props.cancelNextRequest = false;

        props.update = gamePlayUpdate;
        
        // Set up new game
        gameState.wipeGameState();
        // call any init methods on gameState

        // Set or reset newGame flag to false
        gameState.setNewGameProperty(false);
        
        // Start game loop
        props.lastTimeStamp = performance.now();
        requestAnimationFrame(gameLoop);
    }

    function resumeGame() {
        props.cancelNextRequest = false;

        // Start game loop
        props.lastTimeStamp = performance.now();
        requestAnimationFrame(gameLoop);
    }

    function initialize() {
        console.log('game initializing...');

        props.canvas = document.getElementById('canvas-main');
        props.context = props.canvas.getContext('2d');

        CanvasRenderingContext2D.prototype.clear = function() {
            this.save();
            this.setTransform(1, 0, 0, 1, 0, 0);
            this.clearRect(0, 0, props.canvas.width, props.canvas.height);
            this.restore();
        };

        // Register commands here
        keyboard.registerCommand(input.keyCodes.DOM_VK_ESCAPE, function() {
            props.cancelNextRequest = true;
            if (gameState.getState() === 'gameover') {
                gameState.setNewGameProperty(true);
                game.showScreen('main-menu');
            }
            else {
                game.showScreen('paused-menu');
            }
        });

        keyboard.registerCommand(input.keyCodes.DOM_VK_RIGHT, function(elapsedTime) {
            stateChanges.moveDirection = 'right';
        });
        keyboard.registerCommand(input.keyCodes.DOM_VK_LEFT, function(elapsedTime) {
            stateChanges.moveDirection = 'left';
        });
        keyboard.registerCommand(input.keyCodes.DOM_VK_UP, function(elapsedTime) {
            stateChanges.moveDirection = 'up';
        });
        keyboard.registerCommand(input.keyCodes.DOM_VK_DOWN, function(elapsedTime) {
            stateChanges.moveDirection = 'down';
        });
    }

    function processInput(elapsedTime) {
        keyboard.handleEvents(elapsedTime);
    }

    function gameOverUpdate(elapsedTime) {
        // Undo any state changes - this is hacky
        stateChanges.moveDirection = null;
    }

    function gamePlayUpdate(elapsedTime) {

        props.accumulatingSecond += elapsedTime;

        if (props.accumulatingMoveInterval >= MOVE_INTERVAL) {
            gameState.moveSnake(stateChanges.moveDirection);
            props.accumulatingMoveInterval = 0;
        }
        
        // Any collision handling here

        // State change on certain conditions

        // If setting the gameOverUpdate remember to also do the following
        // gameState.setState('gameover');
        // updateHighScores(gameState.getScore());
    }

    function render(elapsedTime) {
        renderer.render(props.context, elapsedTime);
    }

    function gameLoop(time) {
        let elapsedTime = time - props.lastTimeStamp; 
        props.update(elapsedTime);
        processInput(elapsedTime);
        render(elapsedTime);
        props.lastTimeStamp = time;
        if (!props.cancelNextRequest) {
            requestAnimationFrame(gameLoop);
        }
    }

    function run() {
        if (gameState.getNewGameProperty()) {
            startNewGame();
        }
        else {
            resumeGame();
        }
    }

    return {
        initialize,
        run
    };
}(MyGame.game, Input, MyGame.gameState, MyGame.renderer));