const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

let player;
let cursors;
let bullets;
let lastFired = 0;

const game = new Phaser.Game(config);

function preload() {
  this.load.image('player', 'assets/player.png');
  this.load.image('bullet', 'assets/bullet.png');
}

function create() {
  player = this.physics.add.sprite(100, 450, 'player');
  player.setCollideWorldBounds(true);

  bullets = this.physics.add.group();

  cursors = this.input.keyboard.createCursorKeys();

  this.input.keyboard.on('keydown-SPACE', () => {
    if (this.time.now > lastFired) {
      const bullet = bullets.create(player.x + 20, player.y, 'bullet');
      bullet.setVelocityX(500);
      bullet.setGravityY(-500);
      lastFired = this.time.now + 300;
    }
  });
}

function update() {
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
  } else {
    player.setVelocityX(0);
  }

  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-350);
  }
}
