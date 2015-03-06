var HealthBar = function(game, initX, initY, width) {
    Phaser.Graphics.call(this, game, 0, 0);

    this.game = game;
    this.game.add.existing(this);

    this.x = initX;
    this.y = initY;
    this.w = width;

    this.drawLine(1);
};

HealthBar.prototype = Object.create(Phaser.Graphics.prototype);
HealthBar.prototype.constructor = HealthBar;

HealthBar.prototype.updateHealthBar = function(health, maxHealth) {
    this.drawLine(health/maxHealth);
};

HealthBar.prototype.drawLine = function(ratio) {
    this.clear();
    this.lineStyle(4, 0x000000, 1);
    this.moveTo(0, 0);
    this.lineTo(this.w, 0);
    this.lineStyle(4, 0x00BB00, 1);
    this.moveTo(0, 0);
    this.lineTo(this.w * ratio, 0);
};
