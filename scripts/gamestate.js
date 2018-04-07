MyGame.gameState = (function() {
    'use strict';

    let GRID_MAX = 49;
    let OBSTACLE_COUNT = 15;

    let props = {
        countdown: 3,
        state: 'countdown',
        newGame: true,
        score: 1,
        growths: 0
    };

    let food = {x: null, y: null};

    function Queue() {
        // Taken from Dr. Mathias's Queue code
        let that = [];
        that.enqueue = function(value) {
            that.push(value);
        }

        that.dequeue = function() {
            return that.shift();
        }

        Object.defineProperty(that, 'back', {
            get: () => that[that.length - 1]
        });

        Object.defineProperty(that, 'front', {
            get: () => that[0]
        });

        Object.defineProperty(that, 'empty', {
            get: () => { return that.length === 0; }
        });

        that.prevDirection = null;

        return that;
    }

    let obstacleMap = []; // Will be 2d

    let obstacles = [];
    let snake = Queue();

    // Source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
      }

    function initObstacles() {
        for (let i = 0; i < GRID_MAX; i++) {
            obstacleMap.push([]);
            for (let j = 0; j < GRID_MAX; j++) {
                obstacleMap[i].push('empty');
            }
        }
        let obstacles_added = 0;
        while (obstacles_added < OBSTACLE_COUNT) {
            let randX = getRandomIntInclusive(1, GRID_MAX - 1);
            let randY = getRandomIntInclusive(1, GRID_MAX - 1);
            if (obstacleMap[randX][randY] === 'empty') {
                obstacleMap[randX][randY] = 'block';
                obstacles.push({x: randX, y: randY});
                obstacles_added++;
            }
        }
    }

    function initSnake() {
        let goodPos = false;
        while (!goodPos) {
            let randX = getRandomIntInclusive(1, GRID_MAX - 1);
            let randY = getRandomIntInclusive(1, GRID_MAX - 1);
            if (obstacleMap[randX][randY] === 'empty') {
                goodPos = true;
                snake.enqueue({x: randX, y: randY});
            }
        }
    }

    function generateFood() {
        let done = false;
        while (!done) {
            let randX = getRandomIntInclusive(1, GRID_MAX - 1);
            let randY = getRandomIntInclusive(1, GRID_MAX - 1);
            if (obstacleMap[randX][randY] === 'empty') {
                done = true;
                food.x = randX;
                food.y = randY;
                obstacleMap[randX][randY] = 'food';
            }
        }
    }

    function addGrowths() {
        props.growths += 3;
    }

    function moveSnake(direction) {
        if (direction === null) {
            return;
        }
        switch (direction) {
            case 'right':
                snake.enqueue({
                    x: snake.back.x + 1,
                    y: snake.back.y
                });
                break;
            case 'left':
                snake.enqueue({
                    x: snake.back.x - 1,
                    y: snake.back.y
                });
                break;
            case 'up':
                snake.enqueue({
                    x: snake.back.x,
                    y: snake.back.y - 1
                });
                break;
            case 'down':
                snake.enqueue({
                    x: snake.back.x,
                    y: snake.back.y + 1
                });
                break;
        }
        snake.prevDirection = direction;

        if (props.growths > 0) {
            props.growths--;
            props.score++;
        }
        else {
            let lastPos = snake.dequeue();
            obstacleMap[lastPos.x][lastPos.y] = 'empty';
        }
    }

    function getState() {
        return props.state;
    }

    function setState(state) {
        props.state = state;
    }

    function setNewGameProperty(value) {
        props.newGame = value;
    }

    function getNewGameProperty() {
        return props.newGame;
    }

    function countdown() {
        if (props.countdown >= 0) {
            props.countdown--;
        }
    }

    function getCountdown() {
        return props.countdown;
    }

    function getScore() {
        return props.score;
    }

    function wipeGameState() {
        snake.splice(0, snake.length);
        snake.prevDirection = null;
        obstacleMap.splice(0, obstacleMap.length);
        obstacles.splice(0, obstacles.length);

        props.countdown = 3;
        props.state = 'countdown';
        props.score = 1;
        props.growths = 0;
    }

    return {
        getState,
        setState,
        wipeGameState,
        setNewGameProperty,
        getNewGameProperty,
        addGrowths,
        getScore,
        initObstacles,
        initSnake,
        moveSnake,
        obstacles,
        snake,
        food,
        generateFood,
        obstacleMap,
        getCountdown,
        countdown
    };
}());