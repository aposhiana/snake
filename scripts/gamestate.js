MyGame.gameState = (function() {
    'use strict';

    let props = {
        state: 'gameplay',
        newGame: true,
        score: 0,
        growths: 0
    };

    function Queue() {
        // Taken from Dr. Mathias's Queue code
        let that = [];
        that.enqueue = function(value) {
            that.push(value);
        }

        that.dequeue = function() {
            return that.shift();
        }

        Object.defineProperty(that, 'front', {
            get: () => that[0]
        });

        Object.defineProperty(that, 'empty', {
            get: () => { return that.length === 0; }
        });

        return that;
    }

    // Will be 2d
    let obstacles = [];
    let snake = Queue();

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
                    x: snake.front.x + 1,
                    y: snake.front.y
                });
                break;
            case 'left':
                snake.enqueue({
                    x: snake.front.x - 1,
                    y: snake.front.y
                });
                break;
            case 'up':
                snake.enqueue({
                    x: snake.front.x,
                    y: snake.front.y + 1
                });
                break;
            case 'down':
                snake.enqueue({
                    x: snake.front.x,
                    y: snake.front.y - 1
                });
                break;
        if (props.growths > 0) {
            props.growths--;
        }
        else {
            snake.dequeue();
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

    function getScore() {
        return props.score;
    }

    function wipeGameState() {
        // balls.splice(0, balls.length); // Keep same array reference

        props.countdown = 3;
        props.state = 'countdown';
        props.score = 0;
    }

    return {
        getState,
        setState,
        wipeGameState,
        setNewGameProperty,
        getNewGameProperty,
        getScore
    };
}());