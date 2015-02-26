var land;
var hero;
var cursors;
var socket;
var blue_team;
var red_team;
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
    game.load.image('hero', '/static/sprites/hero.png');
    game.load.spritesheet('earth', '/static/sprites/map.png', 10, 10, 10);

    game.load.atlasJSONHash('ranger', '/static/sprites/ranger/ranger.png', '/static/sprites/ranger/ranger.json');
    game.load.atlasJSONHash('healer', '/static/sprites/healer/healer.png', '/static/sprites/healer/healer.json');
    game.load.atlasJSONHash('ninja', '/static/sprites/ninja/ninja.png', '/static/sprites/ninja/ninja.json');
}

function create() {
    var websocketURL = 'http://' + window.location.host + '/websocket';
    socket = new SockJS(websocketURL);

    //  Resize our game world to be a 2000 x 2000 square
    game.world.setBounds(-1000, -1000, 2000, 2000);

    //  Our tiled scrolling background
    land = game.add.tileSprite(0, 0, 800, 600, 'earth');
    land.fixedToCamera = true;

    //  The base of our hero
    //hero = game.add.sprite(0, 0, 'hero', 'hero');
    hero = createHero();
    //hero.animations.add('move', ['hero1', 'hero2', 'hero3', 'hero4', 'hero5', 'hero6'], 20, true);

    game.camera.follow(hero);
    game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    game.camera.focusOnXY(0, 0);

    cursors = game.input.keyboard.createCursorKeys();

    var ranger = game.add.sprite(0, 0, 'ranger');
    ranger.animations.add('d', [0, 1, 2]);
    ranger.animations.play('d', 5, true);

    var ranger = game.add.sprite(20, 0, 'ranger');
    ranger.animations.add('l', [3, 4, 5]);
    ranger.animations.play('l', 5, true);

    var ranger = game.add.sprite(40, 0, 'ranger');
    ranger.animations.add('r', [6, 7, 8]);
    ranger.animations.play('r', 5, true);

    var ranger = game.add.sprite(60, 0, 'ranger');
    ranger.animations.add('u', [9, 10, 11]);
    ranger.animations.play('u', 5, true);


    // healer
    var healer = game.add.sprite(0, 20, 'healer');
    healer.animations.add('d', [0, 1, 2]);
    healer.animations.play('d', 5, true);

    var healer = game.add.sprite(20, 20, 'healer');
    healer.animations.add('l', [3, 4, 5]);
    healer.animations.play('l', 5, true);

    var healer = game.add.sprite(40, 20, 'healer');
    healer.animations.add('r', [6, 7, 8]);
    healer.animations.play('r', 5, true);

    var healer = game.add.sprite(60, 20, 'healer');
    healer.animations.add('u', [9, 10, 11]);
    healer.animations.play('u', 5, true);


    // ninja

    var ninja = game.add.sprite(0, 40, 'ninja');
    ninja.animations.add('d', [0, 1, 2]);
    ninja.animations.play('d', 5, true);

    var ninja = game.add.sprite(20, 40, 'ninja');
    ninja.animations.add('l', [3, 4, 5]);
    ninja.animations.play('l', 5, true);

    var ninja = game.add.sprite(40, 40, 'ninja');
    ninja.animations.add('r', [6, 7, 8]);
    ninja.animations.play('r', 5, true);

    var ninja = game.add.sprite(60, 40, 'ninja');
    ninja.animations.add('u', [9, 10, 11]);
    ninja.animations.play('u', 5, true);

    setSocketListeners();
}

function update() {
    hero.update(cursors);
    hero.body.velocity.x = 0;
    hero.body.velocity.y = 0;

    if (cursors.left.isDown) {
        hero.body.velocity.x = -200;
    }
    else if (cursors.right.isDown) {
        hero.body.velocity.x = 200;
    }

    if (cursors.up.isDown) {
        hero.body.velocity.y = -200;
    }
    else if (cursors.down.isDown) {
        hero.body.velocity.y = 200;
    }

    land.tilePosition.x = -game.camera.x;
    land.tilePosition.y = -game.camera.y;

    if (game.input.activePointer.isDown) {
        console.log("FIRE");
    }
}

function render() {
    // game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length, 32, 32);
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
        //blue_team = evt.data['teams'][0]
        //red_team = evt.data['teams'][0]
    };

    socket.onclose = function() {
        console.log('Connection closed.');
    };

}

function createHero() {
    var pom = null;
    switch (gameParams.characterClass) {
        case 'warrior':
            pom = new Warrior(game, gameParams['username'], true, 0, 0);
            break;
        case 'healer':
            pom = new Healer(game, gameParams['username'], true, 0, 0);
            break;
        case 'mage':
            pom = new Mage(game, gameParams['username'], true, 0, 0);
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

