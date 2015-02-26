var land;
var hero;
var map;
var layer;
var socket;
var blueTeam = [];
var redTeam = [];
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
    game.load.image('tiles', '/static/desert.png');

    game.load.atlasJSONHash('ranger', '/static/sprites/ranger/ranger.png', '/static/sprites/ranger/ranger.json');
    game.load.atlasJSONHash('healer', '/static/sprites/healer/healer.png', '/static/sprites/healer/healer.json');
    game.load.atlasJSONHash('ninja', '/static/sprites/ninja/ninja.png', '/static/sprites/ninja/ninja.json');
}

function create() {
    var websocketURL = 'http://' + window.location.host + '/websocket';
    socket = new SockJS(websocketURL);

    //  Resize our game world to be a 2000 x 2000 square
    game.world.setBounds(0, 0, 2400, 1200);

    map = game.add.tilemap('desertMap');

    map.addTilesetImage('desertTiles', 'tiles');
    map.fixedToCamera = true;

    layer = map.createLayer('Base');
    layer.resizeWorld();

    //  The base of our hero
    hero = createHero(gameParams['characterClass'], gameParams['username']);

    game.camera.follow(hero);
    game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    game.camera.focusOnXY(0, 0);

    setSocketListeners();
}

function update() {
    hero.update();

    // map.tilePosition.x = -game.camera.x;
    // map.tilePosition.y = -game.camera.y;

    if (game.input.activePointer.isDown) {
        console.log("FIRE");
    }
    updateTeam(blueTeam, blueTeamData);
    updateTeam(redTeam, redTeamData);
}

function updateTeam(team, teamData){
    for(var i=0;i<teamData.length;i++){
        var player = teamData[i];
        if(!team[player['username']]){
            team[player['username']] = createHero(player['character_class'], player['username'])
        }
        team[player['username']].receiveMessage(player['position']);
    }
}

function render() {
    game.debug.text('woot', 32, 32);
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
        //{"content": {"spells": [], "teams": {"blue": {"players": [{"username": "bbb", "room": "darwinbattle", "character_class": "warrior", "hp": 130, "team": "blue", "position": {"y": 0, "x": 0}, "last_death": 0}], "building_hp": 600, "kills": 0}, "red": {"players": [], "building_hp": 600, "kills": 0}}}, "type": "BE_ALL_MAIN_BROADCAST"}
        var data = JSON.parse(evt.data);
        if (data['type'] == 'BE_ALL_MAIN_BROADCAST'){
            blueTeamData = data['content']['teams']['blue']['players'];
            redTeamData = data['content']['teams']['red']['players'];
        }
    };

    socket.onclose = function() {
        console.log('Connection closed.');
    };

}

function createHero(characterClass, username) {
    var pom = null;
    switch (gameParams.characterClass) {
        case 'warrior':
            pom = new Warrior(game, gameParams['username'], true, 0, 0);
            break;
        case 'healer':
            pom = new Healer(game, gameParams['username'], true, 10, 10);
            break;
        case 'mage':
            pom = new Mage(game, gameParams['username'], true, 20, 20);
            break;
    }
    return pom;
}

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'canvas', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

