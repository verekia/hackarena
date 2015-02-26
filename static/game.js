var land;
var hero;
var map;
var layer;
var layerObstacles;
var socket;
var blueTeam = {};
var redTeam = {};
var blueTeamData = [];
var redTeamData = [];
var gameParams = parseUrlParams();


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

function preload() {
    // Sets up map stuff
    game.load.tilemap('desertMap', '/static/desert.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', '/static/map.png');

    game.load.atlasJSONHash('ranger', '/static/sprites/ranger/ranger.png', '/static/sprites/ranger/ranger.json');
    game.load.atlasJSONHash('healer', '/static/sprites/healer/healer.png', '/static/sprites/healer/healer.json');
    game.load.atlasJSONHash('ninja', '/static/sprites/ninja/ninja.png', '/static/sprites/ninja/ninja.json');
}

function create() {
    var websocketURL = 'http://' + window.location.host + '/websocket';
    socket = new SockJS(websocketURL);

    //  Resize our game world to be a 2000 x 2000 square
    game.world.setBounds(0, 0, 1008, 608);

    map = game.add.tilemap('desertMap');

    map.addTilesetImage('desertTiles', 'tiles');
    map.fixedToCamera = true;

    layer = map.createLayer('Base');
    layer.resizeWorld();

    layerObstacles = map.createLayer('obstacles');
    layerObstacles.resizeWorld();


    //  The base of our hero
    hero = createHero(gameParams['characterClass'], gameParams['username'], gameParams['team'], true);
    if (hero.team === 'blue') {
        blueTeam[hero.characterName] = hero;
    } else {
        redTeam[hero.characterName] = hero;
    }

    game.camera.follow(hero);
    game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    game.camera.focusOnXY(0, 0);

    setSocketListeners();
}

function update() {
    hero.updateTo();

    // map.tilePosition.x = -game.camera.x;
    // map.tilePosition.y = -game.camera.y;

    if (game.input.activePointer.isDown) {
        console.log("FIRE");
    }
    blueTeam = updateTeam(blueTeam, blueTeamData, 'blue');
    redTeam = updateTeam(redTeam, redTeamData, 'red');
    blueTeamData = [];
    redTeamData = [];
}

function updateTeam(team, teamData, teamName) {
    for (var i = 0; i < teamData.length; i++) {
        var player = teamData[i];
        if (!team[player['username']]) {
            team[player['username']] = createHero(player['character_class'], player['username'], teamName, false)
        }
        team[player['username']].receiveMessage(player['position']);
    }
    return team;
}

function render() {

    game.debug.text('', 32, 32);
}

function setSocketListeners() {
    socket.onopen = function() {
        var enterRoomMessage = JSON.stringify({
            type: 'FE_JOIN_ROOM',
            content: gameParams
        });
        this.send(enterRoomMessage);
    };

    socket.onmessage = function(evt) {
        console.log("WORLD UPDATE: ", evt.data);
        var data = JSON.parse(evt.data);
        if (data['type'] == 'BE_ALL_MAIN_BROADCAST') {
            blueTeamData = data['content']['teams']['blue']['players'];
            redTeamData = data['content']['teams']['red']['players'];
        }
    };

    socket.onclose = function() {
        console.log('Connection closed.');
    };

}

function createHero(characterClass, username, team, isLocalPlayer) {
    var pom = null;
    switch (characterClass) {
        case 'warrior':
            pom = new Warrior(game, username, team, isLocalPlayer, 0, 0);
            break;
        case 'healer':
            pom = new Healer(game, username, team, isLocalPlayer, 10, 10);
            break;
        case 'mage':
            pom = new Mage(game, username, team, isLocalPlayer, 20, 20);
            break;
    }
    return pom;
}

var game = new Phaser.Game(1008, 608, Phaser.AUTO, 'canvas', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

