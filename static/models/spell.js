Spell = function(game, startPosition, endPosition, type) {
    //Phaser.Sprite.call(this, game, initX, initY, 'hero');
    Phaser.Graphics.call(this, game, 0, 0);

    this.game = game;
    this.startPosition = startPosition;
    this.endPosition = endPosition;
    this.spellType = type;
    this.game.add.existing(this);

    if (this.startPosition['x'] === this.endPosition['x']) {
        this.direction = 'vertical';
    } else {
        this.direction = 'horizontal'
    }

    if (this.spellType == 'TANK_AOE') {
        this.drawSpellCircle();
    } else {
        this.drawLine();
    }

    this.frame = 15;
    this.frameMax = 15;

    this.maxWidth = this.width;
    this.maxHeight = this.height;
};

Spell.prototype = Object.create(Phaser.Graphics.prototype);
Spell.prototype.constructor = Spell;

Spell.prototype.drawLine = function() {
    this.clear();
    this.lineStyle(4, Math.floor(Math.random() * 16777215), 1);
    this.moveTo(this.startPosition['x'], this.startPosition['y']);
    this.lineTo(this.endPosition['x'], this.endPosition['y']);
}

Spell.prototype.drawSpellCircle = function() {
    this.lineStyle(5, Math.floor(Math.random() * 16777215), 0.8);
    this.beginFill(0xFFFF0B, 0.5);
    this.drawCircle(this.startPosition['x'], this.startPosition['y'], 80);
}

Spell.prototype.update = function() {
    if (this.spellType == 'TANK_AOE') {

    } else {
        if (this.direction === 'vertical') {
            this.startPosition.y = this.startPosition.y + (this.endPosition.y - this.startPosition.y) * ((this.frameMax - this.frame) / this.frameMax);
        } else {
            this.startPosition.x = this.startPosition.x + (this.endPosition.x - this.startPosition.x) * ((this.frameMax - this.frame) / this.frameMax);
        }
        this.drawLine();
    }
    this.frame--;
};

Spell.prototype.destroy = function() {
    this.clear();
};