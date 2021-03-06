var hero,
    map,
    layer,
    layerObstacles,
    socket,
    blueTeam = {},
    redTeam = {},
    blueTeamData = [],
    redTeamData = [],
    spellsData = [],
    redTower,
    blueTower,
    gameParams,
    chatKey,
    chatting = false;

function parseUrlParams() {
    var params = location.pathname.substring(1).split('/'),
        errorMessage = null,
        example = '\nExample: /darwinbattle/jon/blue/warrior';

    if (!/^[a-zA-Z]+$/.test(params[0])) {
        errorMessage = 'The room name must be letters only.';
    } else if (!/^[a-zA-Z]+$/.test(params[1])) {
        errorMessage = 'The username must be letters only.';
    } else if (params.length !== 4) {
        errorMessage = 'Not the right number of parameters.';
    } else if (params[2] !== 'red' && params[2] !== 'blue') {
        errorMessage = 'Team parameter must be \'red\' or \'blue\'.';
    } else if (params[3] !== 'warrior' && params[3] !== 'mage' && params[3] !== 'healer') {
        errorMessage = 'Class parameter must be \'warrior\', \'mage\', or \'healer\'.';
    }

    if (errorMessage) {
        alert(errorMessage + example);

        return null;
    }

    return {
        'room': params[0],
        'username': params[1],
        'team': params[2],
        'characterClass': params[3],
    };
}

function preload() {
    // Sets up map stuff
    game.load.tilemap('desertMap', '/static/desert.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', '/static/map.png');

    game.load.image('tower_red', '/static/sprites/tower_red.png');
    game.load.image('tower_blue', '/static/sprites/tower_blue.png');

    game.load.atlasJSONHash('ranger', '/static/sprites/ranger/ranger.png', '/static/sprites/ranger/ranger.json');
    game.load.atlasJSONHash('healer', '/static/sprites/healer/healer.png', '/static/sprites/healer/healer.json');
    game.load.atlasJSONHash('ninja', '/static/sprites/ninja/ninja.png', '/static/sprites/ninja/ninja.json');

    game.load.atlasJSONHash('blood', '/static/sprites/blood/blood.png', '/static/sprites/blood/blood.json');

    game.load.audio('railgun', '/static/sounds/railgun.mp3');
    game.load.audio('heal', '/static/sounds/heal.mp3');
    game.load.audio('spell', '/static/sounds/spell.wav');
    game.load.audio('simple_spell', '/static/sounds/simple_spell.wav');
    game.load.audio('punch', '/static/sounds/punch.wav');
    game.load.audio('fatality', '/static/sounds/fatality.mp3');
}

function create() {
    var websocketURL = 'http://' + window.location.host + '/websocket';
    socket = new SockJS(websocketURL);

    //  Resize our game world to be a 2000 x 2000 square
    game.world.setBounds(0, 0, 1008, 608);

    map = game.add.tilemap('desertMap');

    map.addTilesetImage('map', 'tiles');
    map.fixedToCamera = true;

    layer = map.createLayer('Base');
    layer.resizeWorld();

    layerObstacles = map.createLayer('obstacles');
    layerObstacles.resizeWorld();

    //  The base of our hero
    hero = createHero(gameParams.characterClass, gameParams.username, gameParams.team, true);

    if (hero.team === 'blue') {
        blueTeam[hero.characterName] = hero;
    } else {
        redTeam[hero.characterName] = hero;
    }

    game.camera.follow(hero);
    game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    game.camera.focusOnXY(0, 0);

    setSocketListeners();

    chatKey = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    chatKey.onDown.add(function () {
        if (!$('#chat-input').val()) {
            toggleChat();
        } else {
            sendChatMessage();
            toggleChat();
        }
    }.bind(this));

    $('#chat-input').focus(function () {
        hero.disableKeys();
    });

    $('#chat-input').blur(function () {
        hero.enableKeys();
    });

    // BLOOD
    // var blood = game.add.sprite(60, 60, 'blood');
    // blood.animations.add('blood');
    // blood.animations.play('blood', 10, true);
}

function update() {
    hero.updateTo();

    // map.tilePosition.x = -game.camera.x;
    // map.tilePosition.y = -game.camera.y;

    if (spellsData.length > 0) {
        updateSpells();
    }
    blueTeamData = [];
    redTeamData = [];

    // Update all heroes to flash when hit
    var key;

    for (key in blueTeam) {
        if (blueTeam.hasOwnProperty(key)) {
            blueTeam[key].updateHitFlash();
        }
    }

    for (key in redTeam) {
        if (redTeam.hasOwnProperty(key)) {
            redTeam[key].updateHitFlash();
        }
    }
}

function updateTeam(team, teamData, teamName) {
    var activeUsers = Object.keys(team),
        processedUsers = {},
        i,
        player;

    for (i = 0; i < teamData.length; i++) {
        player = teamData[i];

        if (!team[player.username]) {
            team[player.username] = createHero(player.character_class, player.username, teamName, false);
        }
        team[player.username].receiveMessage(player);
        processedUsers[player.username] = true;
    }

    for (i = 0; i < activeUsers.length; i++) {
        if (!processedUsers[activeUsers[i]]) {
            team[activeUsers[i]].destroyHero();
            delete team[activeUsers[i]];
        }
    }

    return team;
}

function updateKills(blueKills, redKills) {
    $('.js-kills-blue').html(blueKills);
    $('.js-kills-red').html(redKills);
}

function updateSpells() {
    var tmpSpells = [],
        i,
        spellData;

    for (i = 0; i < spellsData.length; i++) {
        spellData = spellsData[i];
        tmpSpells.push(new Spell(game, spellData));
        hero.bringToTop();
        spellsData.splice(i, 1);
        i--;
    }

    setTimeout(function () {
        for (var i = 0; i < tmpSpells.length; i++) {
            tmpSpells[i].destroy();
        }
        tmpSpells = null;
    }, 120);
}

function render() {
    game.debug.text('', 32, 32);
}

function setSocketListeners() {
    socket.onopen = function() {
        var enterRoomMessage = JSON.stringify({
            type: 'FE_JOIN_ROOM',
            content: gameParams,
        });
        this.send(enterRoomMessage);
    };

    socket.onmessage = function(evt) {
        var data = JSON.parse(evt.data);

        if (data.type === 'BE_ALL_MAIN_BROADCAST') {
            blueTeamData = data.content.teams.blue.players;
            redTeamData = data.content.teams.red.players;
            updateTeam(blueTeam, blueTeamData, 'blue');
            updateTeam(redTeam, redTeamData, 'red');
            spellsData.push.apply(spellsData, data.content.spells);
            updateKills(
                data.content.teams.blue.kills,
                data.content.teams.red.kills
            );

            if (!redTower) {
                redTower = new Tower(
                    game,
                    data.content.teams.red.building_position.x,
                    data.content.teams.red.building_position.y,
                    'red'
                );
            }

            if (!blueTower) {
                blueTower = new Tower(
                    game,
                    data.content.teams.blue.building_position.x,
                    data.content.teams.blue.building_position.y,
                    'blue'
                );
            }
            redTower.updateTower(
                data.content.teams.red.building_hp,
                data.content.teams.red.building_max_hp
            );
            blueTower.updateTower(
                data.content.teams.blue.building_hp,
                data.content.teams.blue.building_max_hp
            );
        } else if (data.type === 'BE_SEND_CHAT') {
            addChatMessage(data.content);
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

function sendChatMessage() {
    var message = $('#chat-input').val();
    socket.send(JSON.stringify({
        type: 'FE_SEND_CHAT',
        content: {
            'message': message,
        },
    }));
    $('#chat-input').val('');
}

function addChatMessage(data) {
    var sender = data.username,
        message = data.message,
        timestamp = data.timestamp,
        color = '#555555',
        li = $('<li>');

    if (data.team) {
        if (data.team === 'red') {
            color = '#DD0000';
        } else if (data.team === 'blue') {
            color = '#0000DD';
        }
    }

    li.append($('<strong>').text('[' + timestamp + '] '));
    li.append($('<strong>').css({'color':color}).text(sender + ': '));
    li.append($('<span>').text(message));
    $('.chat-messages').prepend(li);
}

function toggleChat() {
    chatting = !chatting;

    if (chatting) {
        $('#chat-input').focus();
    } else {
        $('#chat-input').blur();
    }
}

$('.js-form').submit(function(event) {
    event.preventDefault();
    window.location = $('#popup-room').val() + '/' + $('#popup-user').val() +
        '/' + $('#popup-team').val() + '/' + $('#popup-class').val();
});

if (location.pathname === '/') {
    $('.js-popup').show();
} else {
    gameParams = parseUrlParams();

    if (!gameParams) {
        window.location = '/';
    }
    $('.ui').show();
    $('.chat-container').show();
    var game = new Phaser.Game(1008, 608, Phaser.AUTO, 'canvas', {
        preload: preload,
        create: create,
        update: update,
        render: render,
    });
}
