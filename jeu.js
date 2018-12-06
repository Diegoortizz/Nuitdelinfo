
var game = new Phaser.Game(800, 600, Phaser.Canvas, 'phaser-example', { preload: preload, create: create, update: update });

function preload() {

    game.load.image('bas', 'Graphics/bas.png');
    game.load.image('face', 'Graphics/haut.png');
    game.load.image('gauche', 'Graphics/gauche.png');
    game.load.image('droite', 'Graphics/droite.png');

    game.load.spritesheet('veggies', 'Graphics/arbre.png', 48,32);

}

var sprite;
var group;
var cursors;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = '#2d2d2d';

    sprite = game.add.sprite(32, 200, 'bas');

    game.physics.arcade.enable(sprite);
    
    group = game.add.physicsGroup();

    for (var i = 0; i < 50; i++)
    {
        var c = group.create(game.rnd.between(100, 770), game.rnd.between(0, 570), 'veggies', 0);
        c.name = "test";
        console.log(c.name);
    }

    for (var i = 0; i < 20; i++)
    {
        var c = group.create(game.rnd.between(100, 770), game.rnd.between(0, 570), 'veggies', 1);
        c.body.immovable = true;
    }

    cursors = game.input.keyboard.createCursorKeys();

    game.time.events.add(Phaser.Timer.SECOND * 10, end, this);
}

function end(){
    console.log("stop");
}

function update() {

    if (game.physics.arcade.collide(sprite, group, collisionHandler, processHandler, this))
    {
        console.log('boom');
    }

    // game.physics.arcade.overlap(sprite, group, collisionHandler, null, this);

    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;

    if (cursors.left.isDown)
    {
        sprite.body.velocity.x = -200;
        sprite.loadTexture("gauche",0, false)
    }
    else if (cursors.right.isDown)
    {
        sprite.body.velocity.x = 200;
        sprite.loadTexture("droite",0, false)
    }

    if (cursors.up.isDown)
    {
        sprite.body.velocity.y = -200;
        sprite.loadTexture("face",0, false)
    }
    else if (cursors.down.isDown)
    {
        sprite.body.velocity.y = 200;
        sprite.loadTexture("bas",0, false)
    }
}

function processHandler (player, veg) {

    return true;

}

function collisionHandler (player, veg) {
    veg.truc = 5;
    console.log(veg.animations.currentFrame.index);
    console.log(veg);
    veg.kill();


}
