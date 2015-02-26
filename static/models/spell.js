Spell = function(game, startPosition, endPosition, type) {
    //Phaser.Sprite.call(this, game, initX, initY, 'hero');
    Phaser.Graphics.call(this, game, 0, 0);

    this.game = game;
    this.game.add.existing(this);
    if (type == 'TANK_AOE') {
        this.lineStyle(5, Math.floor(Math.random()*16777215), 0.8);
        this.beginFill(0xFFFF0B, 0.5);
        this.drawCircle(startPosition['x'], startPosition['y'], 80);
    } else {
        this.lineStyle(4, Math.floor(Math.random()*16777215), 1);
        this.moveTo(startPosition['x'], startPosition['y']);
        this.lineTo(endPosition['x'], endPosition['y']);
    }

    setTimeout(this.remove.bind(this), 250);
};

Spell.prototype = Object.create(Phaser.Graphics.prototype);
Spell.prototype.constructor = Spell;

Spell.prototype.remove = function() {
    this.clear();
};