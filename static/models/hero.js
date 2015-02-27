Hero = function(game, characterName, team, isLocal, initX, initY, textureName) {
    Phaser.Sprite.call(this, game, initX, initY, textureName);

    this.receivedServerData = false;

    this.game = game;
    this.characterName = characterName;
    this.team = team;
    this.isLocal = isLocal;
    this.isAttacking = false;
    this.selectedSpellContainer = $('.js-selected-spell');

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

        if(this.characterName === 'jbateson') {
            // Joe needs the Q key to change spells because he's a special snowflake.
            this.actionSwitchKey = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
        } else {
            this.actionSwitchKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        }

        // Track all keys that were pressed between frames to prevent key presses being lost.
        // Make a list of ALL KEYS and gives them each a callback when pressed for any duration
        // which adds them to this.pressedKeys, a list of all keys pressed between frames.
        this.pressedKeys = [];
        this.allKeys = [];
        for (var key in this.moveDirectionKeys) {
            this.allKeys.push(this.moveDirectionKeys[key]);
        }
        for (var key in this.actionDirectionKeys) {
            this.allKeys.push(this.actionDirectionKeys[key]);
        }

        var addPressedKey = function(event) {
            this.pressedKeys.push(event);
        }.bind(this);

        for(var i = 0; i < this.allKeys.length; i++) {
            this.allKeys[i].onDown.add(addPressedKey)
        }
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
    this.hitFlashFrame = 0;
    this.maxHitFlashFrame = 15;
    this.actionCooldown = 0;
    this.moveDelay = 0;
    this.currentAction = 1;

    this.animations.add('UP', [9, 10, 11]);
    this.animations.add('DOWN', [0, 1, 2]);
    this.animations.add('LEFT', [3, 4, 5]);
    this.animations.add('RIGHT', [6, 7, 8]);
    this.animations.play('DOWN', 5, true);
    this.anchor.set(0.5, 0.5);

    // Init collision detection stuff
    game.add.existing(this);

    if (this.team === 'red') {
        this.nameStyleFillDefault = '#FF0000';
    } else {
        this.nameStyleFillDefault = '#0000FF';
    }
    this.nameStyle = {
        font: "12px Arial",
        align: "center",
        fill: this.nameStyleFillDefault
    };

    // Name text
    this.nameText = game.add.text(this.x - 8, this.y + 8, this.characterName, this.nameStyle);
    this.nameText.x = this.x - this.nameText.width / 2;

    // Health bar
    this.healthBar = new HealthBar(game, this.x - 12, this.y - 16, 24);

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

        if (this.isKeyDown(this.moveDirectionKeys.left)) {
            moveMessage.content.direction = 'LEFT'
            this.animations.play('LEFT', 5, true);
        } else if (this.isKeyDown(this.moveDirectionKeys.right)) {
            moveMessage.content.direction = 'RIGHT'
            this.animations.play('RIGHT', 5, true);
        } else if (this.isKeyDown(this.moveDirectionKeys.up)) {
            moveMessage.content.direction = 'UP'
            this.animations.play('UP', 5, true);
        } else if (this.isKeyDown(this.moveDirectionKeys.down)) {
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

    if (this.isKeyDown(this.actionSwitchKey) && this.actionSwitchKey.duration < 0.015) {
        if (this.currentAction === 1) {
            this.currentAction = 2;
        } else {
            this.currentAction = 1;
        }
        this.isAttacking = false;
    }

    this.selectedSpellContainer.html(this.actions[this.currentAction].display_name);

    var actionMessage = {
        type: 'FE_HERO_SPELL',
        content: {
            position_x: Math.floor(this.x),
            position_y: Math.floor(this.y),
            spell_type: this.actions[this.currentAction].id,
            direction: ''
        }
    }

    if (this.isKeyDown(this.actionDirectionKeys.left)) {
        actionMessage.content.direction = 'LEFT'
    } else if (this.isKeyDown(this.actionDirectionKeys.right)) {
        actionMessage.content.direction = 'RIGHT'
    } else if (this.isKeyDown(this.actionDirectionKeys.up)) {
        actionMessage.content.direction = 'UP'
    } else if (this.isKeyDown(this.actionDirectionKeys.down)) {
        actionMessage.content.direction = 'DOWN'
    }

    if (!this.isAttacking && actionMessage.content.direction !== '') {
        this.setCoolDown(this.actions[this.currentAction].id);
        socket.send(JSON.stringify(actionMessage));
    }

    //this.pressedKeys = [];
}

Hero.prototype.updateHitFlash = function() {
    if(this.hitFlashFrame > 0) {
        this.alpha = Math.floor(this.hitFlashFrame/2) % 2;
        this.hitFlashFrame--;
    } else {
        this.alpha = 1;
    }
}

Hero.prototype.isKeyDown = function(key) {
    var keyPressed = false;
    for (var i = 0; i < this.pressedKeys.length; i++) {
        var pressedKey = this.pressedKeys[i];
        if(key.keyCode === pressedKey.keyCode) {
            keyPressed = true;
            // Tried to to this.pressedKeys = [] at the end of updateTo but it caused
            // this.pressedKeys to be emptied at the wrong time. This is an ugly hack
            // but at least it works...
            this.pressedKeys.splice(i,1);
            break;
        }
    }
    return key.isDown || keyPressed;
}

//OVERRIDE THIS ONE
Hero.prototype.setCoolDown = function(){
}

Hero.prototype.destroyHero = function() {
    this.nameText.destroy();
    this.healthBar.destroy();
    this.destroy();
}

Hero.prototype.receiveMessage = function(message) {
    var newX = message['position']['x'] * 16;
    var newY = message['position']['y'] * 16;
    if(!this.receivedServerData) {
        this.x = newX;
        this.y = newY;

        this.nameText.x = newX - this.nameText.width / 2;
        this.nameText.y = newY + 8;

        this.healthBar.x = newX - 12;
        this.healthBar.y = newY - 12;

        this.receivedServerData = true;
    } else {
        var tweenDelay = 1000/60 * this.maxMoveDelay;
        var tween = game.add.tween(this).to({
            x : newX,
            y : newY
        }, tweenDelay).start();

        var nameTextTween = game.add.tween(this.nameText).to({
            x : newX - this.nameText.width / 2,
            y : newY + 8
        }, tweenDelay).start();

        var healthBarTween = game.add.tween(this.healthBar).to({
            x : newX - 12,
            y : newY - 12
        }, tweenDelay).start();
    }

    this.lastPos.x = newX;
    this.lastPos.y = newY;

    if (this.health > message['hp']) {
        debugger;
        this.hitFlashFrame = this.maxHitFlashFrame;
    }
    this.health = message['hp'];
    this.maxHealth = message['MAX_HP'];
    this.healthBar.updateHealthBar(this.health, this.maxHealth);
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