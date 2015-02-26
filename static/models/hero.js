Hero = function(game, characterName, isLocal, messageCallback, initX, initY) {

    this.game = game;
    this.characterName = name;
    this.isLocal = isLocal;

    this.lastPos = {
        x: -1,
        y: -1
    }

    this.pos = {
        x: initX,
        y: initY
    }

    this.vel = {
        x: 0,
        y: 0
    }

    this.health = this.maxHealth;
    this.cooldown = 0;

    // Create hero sprite
    //this.sprite = game.add.sprite(x, y, 'HERO_' + this.characterClass);
    //this.sprite.anchor.set(0.5, 0.5);

    // Init collision detection stuff
    /*this.sprite.name = index.toString();
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.immovable = false;
    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.bounce.setTo(1, 1);*/

    // If local player, listen for keys.
    if (this.isLocal) {
        //game.input.keyboard.onDownCallback(this.handleKeyDown.bind(this));
        this.cursorKeys = this.game.input.keyboard.createCursorKeys();
        this.actionKeys = {
            1: this.game.input.keyboard.addKey(Phaser.Keyboard.Z),
            2: this.game.input.keyboard.addKey(Phaser.Keyboard.X)
        }
    }
};
Hero.prototype = Object.create(Phaser.Sprite.prototype);

Hero.prototype.update = function() {
    this.vel.x = 0;
    this.vel.y = 0;

    if (this.cursorKeys.left.isDown) {
        this.vel.x = -this.speed;
    } else if (this.cursorKeys.right.isDown) {
        this.vel.x = this.speed;
    } else if (this.cursorKeys.up.isDown) {
        this.vel.y = -this.speed;
    } else if (this.cursorKeys.down.isDown) {
        this.vel.y = this.speed;
    }

    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;

    //TODO update sprite

    // Check if there's been a change
    if (this.pos.x !== this.lastPos.x || this.pos.y !== this.lastPos.y) {
        /*this.messageCallback({
            type: 'FE_HERO_POSITION',
            content: {
                name: this.characterName,
                x: this.pos.x,
                y: this.pos.y
            }
        })*/
    }
}

Hero.prototype.handleKeyDown = function(event) {
    var moveMessage = {
        type: 'FE_HERO_MOVE',
        content: {
            name: this.characterName,
            speed: this.speed,
            direction: ''
        }
    };

    var actionMessage = {
        type: 'FE_HERO_ACTION',
        content: {
            name: this.characterName,
            action: -1
        }
    }

    if (event.keyCode === Phaser.Keyboard.UP) {
        message = moveMessage;
        message.content.direction = 'UP';
    } else if (event.keyCode === Phaser.Keyboard.DOWN) {
        message = moveMessage;
        message.content.direction = 'DOWN';
    } else if (event.keyCode === Phaser.Keyboard.LEFT) {
        message = moveMessage;
        message.content.direction = 'LEFT';
    } else if (event.keyCode === Phaser.Keyboard.RIGHT) {
        message = moveMessage;
        message.content.direction = 'RIGHT';
    } else if (event.keyCode === Phaser.Keyboard.Z) {
        message = actionMessage;
        message.content.action = 1;
    } else if (event.keyCode === Phaser.Keyboard.X) {
        message = actionMessage;
        message.content.action = 2;
    }

    messageCallback(message);
}