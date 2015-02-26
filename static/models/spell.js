Spell = function(game, startPosition, endPosition, team) {
    //Phaser.Sprite.call(this, game, initX, initY, 'hero');
    Phaser.Graphics.call(this, game, 0, 0);

    this.game = game;
    this.game.add.existing(this);
    this.lineStyle(4, Math.floor(Math.random()*16777215), 1);
    this.moveTo(startPosition['x'], startPosition['y']);
    this.lineTo(endPosition['x'], endPosition['y']);

    setTimeout(this.remove.bind(this), 250);
};

Spell.prototype = Object.create(Phaser.Graphics.prototype);
Spell.prototype.constructor = Spell;

Spell.prototype.remove = function() {
    this.clear();
};