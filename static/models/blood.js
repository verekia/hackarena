var Blood = function(game, initX, initY) {
    Phaser.Sprite.call(this, game, initX, initY, 'blood');

    this.game = game;
    this.game.add.existing(this);

    var anim = this.animations.add('blood');
    anim.killOnComplete = true;
    anim.onComplete.add(function() {
        this.animations.stop();
        this.kill();
    }.bind(this));
    anim.play('blood', 10, false);
};

Blood.prototype = Object.create(Phaser.Sprite.prototype);
Blood.prototype.constructor = Blood;
