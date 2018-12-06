var game2 = new Phaser.Game(800, 95, Phaser.Canvas, 'phaser-example-2', { preload: preload2, create: create2 });
var game = new Phaser.Game(800, 600, Phaser.Canvas, 'phaser-example', { preload: preload, create: create, update: update });


function preload() {

    game.load.image('bas', 'Graphics/bas.png');
    game.load.image('face', 'Graphics/haut.png');
    game.load.image('gauche', 'Graphics/gauche.png');
    game.load.image('droite', 'Graphics/droite.png');

    game.load.image('baie', 'Graphics/baie.png');
    game.load.image('batterie', 'Graphics/batterie.png');
    game.load.image('arbre', 'Graphics/arbre.png');

    game.load.image('carte', 'Graphics/carte_vierge.png');

}

function preload2() {

    game2.load.image('drink_bar', 'Graphics/drink_bar.png');
    game2.load.image('eat_bar', 'Graphics/eat_bar.png');
    game2.load.image('energy_bar', 'Graphics/energy_bar.png');

}
var cst_down = 0.15;
var sprite;
var group;
var cursors;

var timer;


var eatbar;

var day;
var timer2;
    
var bmpText;


function create2() {


    timer2 = game2.time.events.loop(600, updateDay, this);

    game2.stage.backgroundColor = "#ffffff";

    eatbar = game2.add.sprite(0, 0, 'eat_bar');
    eatbar.cropEnabled = true;

    drinkbar = game2.add.sprite(0, 30, 'drink_bar');
    drinkbar.cropEnabled = true;

    energybar = game2.add.sprite(0, 60, 'energy_bar');
    energybar.cropEnabled = true;


    timer = game2.time.create(false);

    timer.loop(1, update_eatbar, this);
    timer.loop(1, update_drinkbar, this);
    timer.loop(1, update_energybar, this);


    timer.start();

    var style = { font: "16px Arial", fill: "BLACK" };
    day = 121;
    bmpText = game2.add.text(16, 16, "JOURS RESTANTS : " + day, style);

}

function create() {

    game.add.tileSprite(0, 0, game.width, game.height, "carte");

    cursors = game.input.keyboard.createCursorKeys();

    game.physics.startSystem(Phaser.Physics.ARCADE);


    sprite = game.add.sprite(32, 200, 'bas');

    game.physics.arcade.enable(sprite);

    group = game.add.physicsGroup();

    for (var i = 0; i < 30; i++) {
        var c = group.create(game.rnd.between(100, 770), game.rnd.between(0, 570), 'baie');
        c.id = "baie";
        c.body.immovable = true;
    }

    for (var i = 0; i < 30; i++) {
        var c = group.create(game.rnd.between(100, 770), game.rnd.between(0, 570), 'batterie');
        c.id = "batterie";
        c.body.immovable = true;
    }

    for (var i = 0; i < 20; i++) {
        var c = group.create(game.rnd.between(100, 770), game.rnd.between(0, 570), 'arbre');
        c.id = "arbre";
        c.body.immovable = true;
    }

    cursors = game.input.keyboard.createCursorKeys();

    game.time.events.add(Phaser.Timer.SECOND * 10, end, this);
}

function end() {
    console.log("stop");
}

function update() {

    if (game.physics.arcade.collide(sprite, group, collisionHandler, processHandler, this)) {
        console.log('boom');
    }

    // game.physics.arcade.overlap(sprite, group, collisionHandler, null, this);

    sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;

    if (cursors.left.isDown) {
        sprite.body.velocity.x = -200;
        sprite.loadTexture("gauche", 0, false)
    }
    else if (cursors.right.isDown) {
        sprite.body.velocity.x = 200;
        sprite.loadTexture("droite", 0, false)
    }

    if (cursors.up.isDown) {
        sprite.body.velocity.y = -200;
        sprite.loadTexture("face", 0, false)
    }
    else if (cursors.down.isDown) {
        sprite.body.velocity.y = 200;
        sprite.loadTexture("bas", 0, false)
    }
}

function processHandler(player, veg) {
    return true;
}

function collisionHandler(player, veg) {
    if (veg.id == "baie" || veg.id == "batterie") {
        veg.kill();
    }
}

function update_drinkbar() { // 15
    // console.log("drink");
    drinkbar.width -= randomnbr(10, 15, 4);
}

function update_eatbar() { // 10
    // console.log("eat");
    eatbar.width -= randomnbr(5, 10, 4);;
}

function update_energybar() { // 5
    // console.log("energy");
    energybar.width -= randomnbr(1, 6, 4);;
}

function randomnbr(a, b, n) {
    return (Math.random() * ((a / 10) - (b / 10)) + (b / 10)).toFixed(n);
}


function updateDay() {
    day--;
    console.log("in update day")
    bmpText.text = "JOURS RESTANTS : " + day;

}

// Phaser version 2.4.8
// HealthBar 