Hero = function(game, characterName, team, isLocal, initX, initY, textureName) {
    //Phaser.Sprite.call(this, game, initX, initY, 'hero');
    Phaser.Sprite.call(this, game, initX, initY, textureName);

    this.game = game;
    this.characterName = characterName;
    this.team = team;
    this.isLocal = isLocal;

    // If local player, listen for keys.
    if (this.isLocal) {
        //game.input.keyboard.onDownCallback(this.handleKeyDown.bind(this));
        this.moveDirectionKeys = {
            up: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
            left: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
            down: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
            right: this.game.input.keyboard.addKey(Phaser.Keyboard.D)
        };
        this.actionDirectionKeys = this.game.input.keyboard.createCursorKeys();
        this.actionSwitchKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    }

    this.lastPos = {
        x: -1,
        y: -1
    }

    this.vel = {
        x: 0,
        y: 0
    }

    this.health = this.maxHealth;
    this.actionCooldown = 0;
    this.moveDelay = 0;
    this.currentAction = 1;

    this.animations.add('UP', [9, 10, 11]);
    this.animations.add('DOWN', [0,1,2]);
    this.animations.add('LEFT', [3,4,5]);
    this.animations.add('RIGHT', [6, 7, 8]);
    this.animations.play('DOWN', 5, true);
    this.anchor.set(0.5, 0.5);

    // Init collision detection stuff
    game.add.existing(this);

    // Name text
    var style = {
        font: "12px Arial",
        align: "center"
    };
    if(this.team === 'red') {
        style.fill = '#FF0000';
    } else {
        style.fill = '#0000FF';
    }
    this.nameText = game.add.text(this.x - 8, this.y + 8, this.characterName, style);
    this.nameText.x = this.x - this.nameText.width/2;

    // Health bar
    this.healthBar = new HealthBar(game, this.x - 12, this.y - 12);

    game.physics.enable(this, Phaser.Physics.ARCADE);

    this.body.collideWorldBounds = true;

    this.bringToTop();
};

Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.updateTo = function() {
    if (this.moveDelay === 0) {
        var moveMessage = {
            type: 'FE_HERO_MOVE',
            content: {
                name: this.characterName,
                speed: 8,
                direction: ''
            }
        };

        if (this.moveDirectionKeys.left.isDown) {
            moveMessage.content.direction = 'LEFT'
            this.animations.play('LEFT', 5, true);
        } else if (this.moveDirectionKeys.right.isDown) {
            moveMessage.content.direction = 'RIGHT'
            this.animations.play('RIGHT', 5, true);
        } else if (this.moveDirectionKeys.up.isDown) {
            moveMessage.content.direction = 'UP'
            this.animations.play('UP', 5, true);
        } else if (this.moveDirectionKeys.down.isDown) {
            moveMessage.content.direction = 'DOWN'
            this.animations.play('DOWN', 5, true);
        } else {
            this.animations.stop();
        }

        if (moveMessage.content.direction !== '') {
            socket.send(JSON.stringify(moveMessage));
        }
        
        this.moveDelay = this.maxMoveDelay;
    } else {
        this.moveDelay--;
    }

    if (this.actionSwitchKey.isDown && this.actionSwitchKey.duration < 1000/60) {
        if (this.currentAction === 1) {
            this.currentAction = 2;
        } else {
            this.currentAction = 1;
        }
    }

    if (this.actionCooldown === 0) {
        var actionMessage = {
            type: 'FE_HERO_SPELL',
            content: {
                position_x: this.x,
                position_y: this.y,
                spell_type: this.actions[this.currentAction],
                direction: ''
            }
        }

        if (this.actionDirectionKeys.left.isDown) {
            actionMessage.content.direction = 'LEFT'
        } else if (this.actionDirectionKeys.right.isDown) {
            actionMessage.content.direction = 'RIGHT'
        } else if (this.actionDirectionKeys.up.isDown) {
            actionMessage.content.direction = 'UP'
        } else if (this.actionDirectionKeys.down.isDown) {
            actionMessage.content.direction = 'DOWN'
        }

        if (actionMessage.content.direction !== '') {
            //TODO this.messageCallback(moveMessage);
            socket.send(JSON.stringify(actionMessage));
        }
    }
}

Hero.prototype.destroy = function() {
    this.nameText.destroy();
    this.healthBar.destroy();
    this.kill();
}

Hero.prototype.receiveMessage = function(message) {
    this.x = message['position']['x'] * 16;
    this.y = message['position']['y'] * 16;

    this.nameText.x = this.x - this.nameText.width/2;
    this.nameText.y = this.y + 8;

    this.lastPos.x = this.x;
    this.lastPos.y = this.y;

    this.health = message['hp'];
    this.maxHealth = message['MAX_HP'];
    this.healthBar.updateHealthBar(this.x - 12, this.y - 12, this.health, this.maxHealth);
}

Hero.prototype.update_smooth = function() {
    if (this.moveDelay === 0) {
        this.vel.x = 0;
        this.vel.y = 0;

        if (this.moveDirectionKeys.left.isDown) {
            this.vel.x = -8;
        } else if (this.moveDirectionKeys.right.isDown) {
            this.vel.x = 8;
        } else if (this.moveDirectionKeys.up.isDown) {
            this.vel.y = -8;
        } else if (this.moveDirectionKeys.down.isDown) {
            this.vel.y = 8;
        }

        this.x += this.vel.x;
        this.y += this.vel.y;

        // Check if there's been a change
        if (this.x !== this.lastPos.x || this.y !== this.lastPos.y) {
            /*this.messageCallback({
                type: 'FE_HERO_POSITION',
                content: {
                    name: this.characterName,
                    x: this.pos.x,
                    y: this.pos.y
                }
            })*/

            this.moveDelay = this.maxMoveDelay;

            this.lastPos.x = this.x;
            this.lastPos.y = this.y;
        }
    } else {
        this.moveDelay--;
    }
}