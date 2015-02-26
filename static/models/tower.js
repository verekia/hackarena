Tower = function(game, initX, initY, team) {
    //Phaser.Sprite.call(this, game, initX, initY, 'hero');
    Phaser.Graphics.call(this, game, 0, 0);

    this.game = game;
    this.game.add.existing(this);
    
    var color;
    if (team === 'red') {
        color = 0xFF0000;
    } else {
        color = 0x0000FF;
    }
    this.beginFill(color, 1)
    this.drawRect(initX, initY, 32, 32);
};

Tower.prototype = Object.create(Phaser.Graphics.prototype);
Tower.prototype.constructor = Tower;