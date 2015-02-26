Hero = function(game, characterName, characterClass, isLocalPlayer, messageCallback, initX, initY) {

    this.game = game;
    this.characterName = name;
    this.characterClass = characterClass;
    this.isLocalPlayer = isLocalPlayer;

    this.x = initX;
    this.y = initY;

    if (this.characterClass === "WARRIOR") {
        this.maxHealth = 100;
        this.speed = 4;
    } else if (this.characterClass === "MAGE") {
        this.maxHealth = 75;
        this.speed = 6;
    } else if (this.characterClass === "HEALER") {
        this.maxHealth = 50;
        this.speed = 8;
    }

    this.health = this.maxHealth;
    this.cooldown = 0;

    // Create hero sprite
    //this.sprite = game.add.sprite(x, y, 'HERO_' + this.characterClass);
    //this.sprite.anchor.set(0.5, 0.5);

    // Init collision detection stuff
    this.sprite.name = index.toString();
    game.physics.enable(this.sprite, Phaser.Physics.ARCADE);
    this.sprite.body.immovable = false;
    this.sprite.body.collideWorldBounds = true;
    this.sprite.body.bounce.setTo(1, 1);

    // If local player, listen for keys.
    if (this.isLocalPlayer) {
        game.input.keyboard.onDownCallback(this.handleKeyDown.bind(this));
    }
};

Hero.prototype.handleKeyDown = function(event) {
    if (event.keyCode === Phaser.Keyboard.UP) {
        messageCallback({
            status: 'yes'
        })
    } else if (event.keyCode === Phaser.Keyboard.DOWN) {
        //move down
    } else if (event.keyCode === Phaser.Keyboard.LEFT) {
        //move left
    } else if (event.keyCode === Phaser.Keyboard.RIGHT) {
        //move right
    } else if (event.keyCode === Phaser.Keyboard.Z) {
        //action 1
    } else if (event.keyCode === Phaser.Keyboard.X) {
        //action 2
    }
}