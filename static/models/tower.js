Tower = function(game, initX, initY, team) {
    //Phaser.Sprite.call(this, game, initX, initY, 'hero');
    Phaser.Graphics.call(this, game, 0, 0);

    this.game = game;
    this.game.add.existing(this);

    this.x = initX;
    this.y = initY;
    
    var color;
    if (team === 'red') {
        color = 0xFF0000;
    } else {
        color = 0x0000FF;
    }
    this.beginFill(color, 1)
    this.drawRect(0, 0, 32, 32);

    this.healthBar = new HealthBar(game, this.x - 8, this.y - 6, 48);
};

Tower.prototype = Object.create(Phaser.Graphics.prototype);
Tower.prototype.constructor = Tower;

Tower.prototype.updateTower = function (health, maxHealth) {
    this.health = health;
    this.maxHealth = maxHealth;
    this.healthBar.updateHealthBar(this.health, this.maxHealth);
}