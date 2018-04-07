MyGame.screens['game-play'] = (function(game, input, gameState, renderer) {
    'use strict';

    const MOVE_INTERVAL = 140;
    const GRID_MAX = 49;

    let props = {
        lastTimeStamp: performance.now(),
        cancelNextRequest: false,
        canvas: null,
        context: null,
        update: countdownUpdate,
        accumulatingMoveInterval: 0,
        accumulatingSecond: 0
    };

    let keyboard = input.Keyboard();

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

        props.update = countdownUpdate;
        
        // Set up new game
        gameState.wipeGameState();
        gameState.initObstacles();
        gameState.initSnake(); // must come after obstacles
        gameState.generateFood();

        // Set or reset newGame flag to false
        gameState.setNewGameProperty(false);
        
        // Start game loop
        // props.lastTimeStamp = performance.now();
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

    function countdownUpdate(elapsedTime) {
        props.accumulatingSecond += elapsedTime;

        // Undo any state changes - this is hacky
        stateChanges.moveDirection = null;

        if (gameState.getCountdown() <= 0) {
            props.update = gamePlayUpdate;
            gameState.setState('gameplay');
        }
        else if (props.accumulatingSecond >= 1000) {
            gameState.countdown();
            props.accumulatingSecond = 0;
        }
    }

    function handleCollisions() {
        let head = gameState.snake.back;
        let fState = null;

        let outOfBoard = false;
        if ((head.x > (GRID_MAX - 1)) || (head.x < 1) || (head.y > (GRID_MAX - 1)) || (head.y < 1)) {
            outOfBoard = true;
        }
        else {
            fState = gameState.obstacleMap[head.x][head.y];
        }

        if (outOfBoard || (fState === 'block') || (fState === 'snake')) {
            props.update = gameOverUpdate;
            gameState.setState('gameover');
            updateHighScores(gameState.getScore());
        }
        else if (fState === 'food') {
            gameState.addGrowths();
            gameState.obstacleMap[head.x][head.y] = 'snake';
            gameState.generateFood();
        }
        else {
            gameState.obstacleMap[head.x][head.y] = 'snake';
        }
    }

    function gamePlayUpdate(elapsedTime) {

        props.accumulatingMoveInterval += elapsedTime;

        if ((props.accumulatingMoveInterval >= MOVE_INTERVAL) && (stateChanges.moveDirection !== null)) {
            let validMove = true;
            switch (gameState.snake.prevDirection) {
                case 'right':
                    if (stateChanges.moveDirection === 'left') {
                        validMove = false;
                    }
                    break;
                case 'left':
                    if (stateChanges.moveDirection === 'right') {
                        validMove = false;
                    }
                    break;
                case 'up':
                    if (stateChanges.moveDirection === 'down') {
                        validMove = false;
                    }
                    break;
                case 'down':
                    if (stateChanges.moveDirection === 'up') {
                        validMove = false;
                    }
                    break;
            }
            if (validMove) {
                gameState.moveSnake(stateChanges.moveDirection);
            }
            else {
                gameState.moveSnake(gameState.snake.prevDirection);
            }
            props.accumulatingMoveInterval = 0;
            handleCollisions();
        }
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