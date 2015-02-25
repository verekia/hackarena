var Hackarena = {};

(function() {
    // Instantiates the WebSocket connection

    var websocketURL = 'http://' + window.location.host + '/websocket';
    var sock = new SockJS(websocketURL);
    var gameParams = parseUrlParams();

    function main() {
        $('.canvas-container').append(
            'Room: ' + gameParams.room +
            ', Username: ' + gameParams.roomusername +
            ', Team: ' + gameParams.roomteam +
            ', Class: ' + gameParams.characterClass
        );
    }

    function parseUrlParams() {
        // Game URL Example: /roomname/username/team/class 
        var params = location.pathname.substring(1).split('/');
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