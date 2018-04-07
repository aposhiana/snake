MyGame.gameState = (function() {
    'use strict';

    let props = {
        countdown: 3,
        state: 'countdown',
        newGame: true,
        score: 0
    };

    function getState() {
        return props.state;
    }

    function setState(state) {
        props.state = state;
    }

    function countdown() {
        if (props.countdown >= 0) {
            props.countdown--;
        }
    }

    function getCountdown() {
        return props.countdown;
    }

    function resetCountdown() {
        props.countdown = 3;
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
        getCountdown,
        resetCountdown,
        countdown,
        getState,
        setState,
        wipeGameState,
        setNewGameProperty,
        getNewGameProperty,
        getScore
    };
}());