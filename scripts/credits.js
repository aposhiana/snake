// ------------------------------------------------------------------
// 
// The credits screen
//
// ------------------------------------------------------------------
MyGame.screens['credits'] = (function(game) {
    'use strict';

    let props = {
        lastTimeStamp: performance.now(),
        cancelNextRequest: false
    };

    let keyboard = Input.Keyboard();

    function goBack() {
        game.showScreen('main-menu');
        props.cancelNextRequest = true;
    }

    function initialize() {
        keyboard.registerCommand(Input.keyCodes.DOM_VK_ESCAPE, function() {
            props.cancelNextRequest = true;
            game.showScreen('main-menu');
        });
        document.getElementById('credits-back').addEventListener('click', goBack);
    }

    function signalLoop(time) {
        keyboard.handleEvents(time - props.lastTimeStamp);
        document.getElementById('credits-back').focus();
        props.lastTimeStamp = time;
        if (!props.cancelNextRequest) {
            requestAnimationFrame(signalLoop);
        }
    }

    function run() {
        props.cancelNextRequest = false;
        requestAnimationFrame(signalLoop);
    }

    return {
        initialize,
        run
    };
}(MyGame.game));