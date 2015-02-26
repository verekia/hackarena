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

    // Init collision detection stuff
    game.add.existing(this);
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
        }

        if (moveMessage.content.direction !== '') {
            socket.send(JSON.stringify(moveMessage));
        }
        
        this.moveDelay = this.maxMoveDelay;
    } else {
        this.moveDelay--;
    }

    if (this.actionSwitchKey.isDown) {
        if (this.currentAction === 1) {
            this.currentAction = 2;
        } else {
            this.currentAction = 1;
        }
    }

    if (this.actionCooldown === 0) {
        var actionMessage = {
            type: 'FE_HERO_ACTION',
            content: {
                name: this.characterName,
                action: this.currentAction,
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

Hero.prototype.receiveMessage = function(message) {
    this.x = message['x'];
    this.y = message['y'];

    this.lastPos.x = this.x;
    this.lastPos.y = this.y;
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