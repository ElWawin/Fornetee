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
let enemies;
let score = 0;
let scoreText;
let shopText;
let music;
let fireSound;
let jumpSound;

const game = new Phaser.Game(config);

function preload() {
  this.load.image('player', 'assets/player.png');
  this.load.image('bullet', 'assets/bullet.png');
  this.load.image('enemy', 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Red_square.svg/64px-Red_square.svg.png');
  this.load.audio('bgMusic', 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_d46c807a0c.mp3?filename=battle-royale-theme-115894.mp3');
  this.load.audio('fire', 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_2c07e82d67.mp3?filename=laser-shoot-81267.mp3');
  this.load.audio('jump', 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_d6fda5a62e.mp3?filename=jump-14465.mp3');
}

function create() {
  music = this.sound.add('bgMusic', { loop: true });
  music.play();

  fireSound = this.sound.add('fire');
  jumpSound = this.sound.add('jump');

  player = this.physics.add.sprite(100, 450, 'player');
  player.setScale(0.2);
  player.setCollideWorldBounds(true);

  bullets = this.physics.add.group();
  enemies = this.physics.add.group();

  cursors = this.input.keyboard.createCursorKeys();

  this.input.keyboard.on('keydown-SPACE', () => {
    if (this.time.now > lastFired) {
      const bullet = bullets.create(player.x + 20, player.y, 'bullet');
      bullet.setScale(0.05);
      bullet.setVelocityX(500);
      bullet.setGravityY(-500);
      fireSound.play();
      lastFired = this.time.now + 300;
    }
  });

  scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#fff' });
  shopText = this.add.text(600, 16, 'SHOP: +Speed [S]', { fontSize: '20px', fill: '#0f0' });

  this.physics.add.overlap(bullets, enemies, hitEnemy, null, this);

  this.time.addEvent({
    delay: 3000,
    callback: spawnEnemy,
    callbackScope: this,
    loop: true
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
    jumpSound.play();
  }

  if (this.input.keyboard.checkDown(this.input.keyboard.addKey('S'), 500)) {
    if (score >= 10) {
      score -= 10;
      player.setVelocityX(player.body.velocity.x * 1.5);
      scoreText.setText('Score: ' + score);
    }
  }
}

function spawnEnemy() {
  const enemy = enemies.create(800, 500, 'enemy');
  enemy.setScale(0.5);
  enemy.setVelocityX(-100);
}

function hitEnemy(bullet, enemy) {
  bullet.destroy();
  enemy.destroy();
  score += 5;
  scoreText.setText('Score: ' + score);
}
