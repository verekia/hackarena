HealthBar = function(game, initX, initY) {
    Phaser.Graphics.call(this, game, 0, 0);

    this.game = game;
    this.game.add.existing(this);

    this.x = initX;
    this.y = initY;

    this.drawLine(1)
};

HealthBar.prototype = Object.create(Phaser.Graphics.prototype);
HealthBar.prototype.constructor = HealthBar;

HealthBar.prototype.updateHealthBar = function(x, y, health, maxHealth) {
    this.x = x;
    this.y = y;
    this.drawLine(health/maxHealth);
}

HealthBar.prototype.drawLine = function(ratio) {
    this.clear();
    this.lineStyle(4, 0x00BB00, 1);
    this.moveTo(0, 0);
    this.lineTo(24 * ratio, 0);
}

HealthBar.prototype.destroy = function() {
    this.clear();
};