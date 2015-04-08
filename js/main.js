/*** Fruit Smash (c) Bridget Lane bridgetlane.github.io ***/
/* There are multiple explosions that can be enabled by uncommenting ln 98. I removed them because I didn't like the look of them, and they proved to cause lag. */
window.onload = function() {    
    "use strict";
    var game = new Phaser.Game(
                                500, 500,           // Width, height of game in px
                                Phaser.AUTO,        // Graphic rendering
                                'game',     
                                { preload: preload, // Preload function
                                  create: create,   // Creation function
                                  update: update }  // Update function
                               );
    
    var shot_cir;
    var bullets;
    var explosion_imgs = ['explosion', 'explosion1', 'explosion2', 'explosion3'];
    var fruit_imgs = ['apple', 'avocado', 'coconut', 'half_apple', 'half_lemon', 'half_pear', 'half_strawberry', 'kiwi', 'lemon', 'orange', 'pear', 'pomegranate', 'strawberry', 'tomato', 'tomato_slice', 'watermelon'];
    var fruit; var fruitDropTimer;
    var score = 0; var scoreText;
    
    function preload(){
        game.load.image('shot_cir', 'assets/img/shot_cir.png');
        game.load.image('bullet', 'assets/img/bullet.png');
        game.load.spritesheet('explosion', 'assets/img/explosions/explosion.png', 64, 64);//explosion
        game.load.spritesheet('explosion1', 'assets/img/explosions/explosion1.png', 64, 64);//explosion1
        game.load.spritesheet('explosion2', 'assets/img/explosions/explosion2.png', 48, 48);//explosion2
        game.load.spritesheet('explosion3', 'assets/img/explosions/explosion3.png', 64, 64);//explosion3
        game.load.image('apple', 'assets/img/fruit/apple.png');
        game.load.image('avocado', 'assets/img/fruit/avocado.png');
        game.load.image('coconut', 'assets/img/fruit/coconut.png');
        game.load.image('half_apple', 'assets/img/fruit/half_apple.png');
        game.load.image('half_lemon', 'assets/img/fruit/half_lemon.png');
        game.load.image('half_pear', 'assets/img/fruit/half_pear.png');
        game.load.image('half_strawberry', 'assets/img/fruit/half_strawberry.png');
        game.load.image('kiwi', 'assets/img/fruit/kiwi.png');
        game.load.image('lemon', 'assets/img/fruit/lemon.png');
        game.load.image('orange', 'assets/img/fruit/orange.png');
        game.load.image('pear', 'assets/img/fruit/pear.png');
        game.load.image('pomegranate', 'assets/img/fruit/pomegranate.png');
        game.load.image('strawberry', 'assets/img/fruit/strawberry.png');
        game.load.image('tomato', 'assets/img/fruit/tomato.png');
        game.load.image('tomato_slice', 'assets/img/fruit/tomato_slice.png');
        game.load.image('watermelon', 'assets/img/fruit/watermelon.png');
    };
    
    function create(){
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        game.stage.backgroundColor = '#FDEEF4';
        
        shot_cir = game.add.sprite(game.world.centerX, game.world.centerY, 'shot_cir');
        shot_cir.anchor.setTo(0.5, 0.5);
        game.physics.enable(shot_cir, Phaser.Physics.ARCADE);
        shot_cir.body.collideWorldBounds = true;
        
        bullets = game.add.group();
        bullets.enableBody = true;
        
        fruit = game.add.group();
        fruit.enableBody = true;
        
        fruitDropTimer = game.time.now;
        
        scoreText = game.add.text(50, 50, '0', { font: '24px Arial', fill: "#000" });
        scoreText.anchor.set(0.5);
    };

    function update(){
        game.physics.arcade.accelerateToPointer(shot_cir, this.game.input.activePointer, 500, 500, 500);
        
        setTimeout(function(){ if (game.input.mousePointer.isDown) {releaseFire();} }, 100);
        
        if (game.input.mousePointer.isDown){
            releaseFire();
        }
        
        if (game.time.now > (fruitDropTimer + 500)){
            var f = fruit.create(game.rnd.integerInRange(50, 450), 0, fruit_imgs[game.rnd.integerInRange(0, 16)]);
            f.scale.set(0.5, 0.5); game.physics.arcade.enable(f); f.body.gravity.y = 200; f.body.collideWorldBounds = false; f.outOfBoundsKill = true;
            f.angle = game.rnd.integerInRange(-180, 180);
            fruitDropTimer = game.time.now;
        }
        
        game.physics.arcade.overlap(bullets, fruit, handleHit, null, this);
    };
    
    function releaseFire(){
        var firePosX = shot_cir.body.position.x;
        var firePosY = shot_cir.body.position.y;
            
        var bullet = bullets.create(firePosX, firePosY, 'bullet');
        bullet.anchor.set(0.5); bullet.bringToTop();
            
        game.time.events.add(500, function() { bullet.destroy(); }, this);
    };
    
    function handleHit(bullet, f){
        var explosion = game.add.sprite(f.body.position.x, f.body.position.y, 'explosion');//explosion_imgs[game.rnd.integerInRange(0, 3)]);
        explosion.anchor.setTo(0.5, 0.5);
        explosion.animations.add('boom');
        explosion.play('boom', 15, false, true);
        
        f.destroy();
        
        scoreText.text = (++score).toString();
    };
};
