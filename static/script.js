var Hackarena = {};

(function() {
    var gameParams = parseUrlParams();

    // Instantiates the WebSocket connection
    var websocketURL = 'http://' + window.location.host + '/websocket';
    var sock = new SockJS(websocketURL);

    function main() {
        $('.canvas-container').append(
            'Room: ' + gameParams.room +
            ', Username: ' + gameParams.username +
            ', Team: ' + gameParams.team +
            ', Class: ' + gameParams.characterClass
        );

        var hero = new Hero('Ruairi', 'WARRIOR', true, sendMessage, 64, 64);
    }

    function parseUrlParams() {
        var params = location.pathname.substring(1).split('/');

        var errorMessage = null;
        var example = '\nExample: /darwinbattle/jon/blue/warrior';

        if (!/^[a-zA-Z]+$/.test(params[0])) {
            errorMessage = 'The room name must be letters only.';
        } else if (!/^[a-zA-Z]+$/.test(params[1])) {
            errorMessage = 'The username must be letters only.';
        } else if (params.length !== 4) {
            errorMessage = 'Not the right number of parameters.';
        } else if (params[2] !== 'red' && params[2] !== 'blue') {
            errorMessage = "Team parameter must be 'red' or 'blue'.";
        } else if (params[3] !== 'warrior' && params[3] !== 'mage' && params[3] !== 'healer') {
            errorMessage = "Class parameter must be 'warrior', 'mage', or 'healer'.";
        }

        if (errorMessage) {
            alert(errorMessage + example);
            throw errorMessage + example;
        }

        return {
            'room': params[0],
            'username': params[1],
            'team': params[2],
            'characterClass': params[3]
        }
    }


    /**
     *  WebSocket Basic Events
     */

    sock.onopen = function() {
        var enterRoomMessage = JSON.stringify({
            type: 'ROOM',
            content: gameParams.room
        });
        sock.send(enterRoomMessage);
    };

    sock.onmessage = function (evt) {
        dispatchMessage(evt.data);
    };

    sock.onclose = function() {
        console.log('Connection closed.');
    };


    /**
     *  WebSocket Custom Events received from the server (prefixed BE_)
     */

    function dispatchMessage(message) {
        var message = JSON.parse(message);

        if (message.type === 'BE_BLABLA') {
            // Render new state on the front-end using message.content.blabla
        }
    };

    function sendMessage(messageObject) {
        var message = JSON.stringify(messageObject);

        sock.send(message);
    }


    /**
     *  UI Events to send to the server (prefixed with FE_)
     */

    $('.js-blabla').click(function() {
        var blablaMessage = JSON.stringify({
            type: 'FE_BLABLA',
            content: ''
        });
        sock.send(blablaMessage);
    });

    main();
}(window, Hackarena));