var land;
var hero;
var cursors;

function preload() {
    game.load.image('hero', 'static/sprites/hero.png');
    game.load.spritesheet('earth', 'static/sprites/map.png', 10, 10, 10);

    game.load.atlasJSONHash('ranger', 'static/sprites/ranger/ranger.png', 'static/sprites/ranger/ranger.json');
    game.load.atlasJSONHash('healer', 'static/sprites/healer/healer.png', 'static/sprites/healer/healer.json');
    game.load.atlasJSONHash('ninja', 'static/sprites/ninja/ninja.png', 'static/sprites/ninja/ninja.json');
}

function create() {
    //  Resize our game world to be a 2000 x 2000 square
    game.world.setBounds(-1000, -1000, 2000, 2000);

    //  Our tiled scrolling background
    land = game.add.tileSprite(0, 0, 800, 600, 'earth');
    land.fixedToCamera = true;

    //  The base of our hero
    //hero = game.add.sprite(0, 0, 'hero', 'hero');
    hero = new Hero(game, 0,0);
    //hero.animations.add('move', ['hero1', 'hero2', 'hero3', 'hero4', 'hero5', 'hero6'], 20, true);

    game.camera.follow(hero);
    game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    game.camera.focusOnXY(0, 0);

    cursors = game.input.keyboard.createCursorKeys();

    //var ranger = game.add.sprite(16, 18, 'ranger');
    //ranger.animations.add('r');
    //ranger.animations.play('r', 5, true);

    var ranger = game.add.sprite(0, 0, 'ranger');
    ranger.animations.add('d', [0,1,2]);
    ranger.animations.play('d', 5, true);

    var ranger = game.add.sprite(20, 0, 'ranger');
    ranger.animations.add('l', [3,4,5]);
    ranger.animations.play('l', 5, true);

    var ranger = game.add.sprite(40, 0, 'ranger');
    ranger.animations.add('r', [6, 7, 8]);
    ranger.animations.play('r', 5, true);

    var ranger = game.add.sprite(60, 0, 'ranger');
    ranger.animations.add('u', [9, 10, 11]);
    ranger.animations.play('u', 5, true);



    // healer

    var healer = game.add.sprite(0, 20, 'healer');
    healer.animations.add('d', [0,1,2]);
    healer.animations.play('d', 5, true);

    var healer = game.add.sprite(20, 20, 'healer');
    healer.animations.add('l', [3,4,5]);
    healer.animations.play('l', 5, true);

    var healer = game.add.sprite(40, 20, 'healer');
    healer.animations.add('r', [6, 7, 8]);
    healer.animations.play('r', 5, true);

    var healer = game.add.sprite(60, 20, 'healer');
    healer.animations.add('u', [9, 10, 11]);
    healer.animations.play('u', 5, true);


    // ninja

    var ninja = game.add.sprite(0, 40, 'ninja');
    ninja.animations.add('d', [0,1,2]);
    ninja.animations.play('d', 5, true);

    var ninja = game.add.sprite(20, 40, 'ninja');
    ninja.animations.add('l', [3,4,5]);
    ninja.animations.play('l', 5, true);

    var ninja = game.add.sprite(40, 40, 'ninja');
    ninja.animations.add('r', [6, 7, 8]);
    ninja.animations.play('r', 5, true);

    var ninja = game.add.sprite(60, 40, 'ninja');
    ninja.animations.add('u', [9, 10, 11]);
    ninja.animations.play('u', 5, true);

}

function update() {
    hero.update(cursors);
    hero.body.velocity.x = 0;
    hero.body.velocity.y = 0;

    if (cursors.left.isDown) {
        hero.body.velocity.x = -200;
    }
    else if (cursors.right.isDown) {
        hero.body.velocity.x = 200;
    }

    if (cursors.up.isDown) {
        hero.body.velocity.y = -200;
    }
    else if (cursors.down.isDown) {
        hero.body.velocity.y = 200;
    }

    land.tilePosition.x = -game.camera.x;
    land.tilePosition.y = -game.camera.y;

    if (game.input.activePointer.isDown) {
        console.log("FIRE");
    }
}

function render() {
    // game.debug.text('Active Bullets: ' + bullets.countLiving() + ' / ' + bullets.length, 32, 32);
    game.debug.text('woot', 32, 32);
}

var game = new Phaser.Game(800, 600, Phaser.AUTO, 'canvas', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

