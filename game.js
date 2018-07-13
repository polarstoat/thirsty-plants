function preload() {
  // Load sprites
  this.load.image('background', 'sprites/background.png');

  this.load.spritesheet('player', 'sprites/player.png', {
    frameWidth: 64,
    frameHeight: 96,
  });

  this.load.spritesheet('plant', 'sprites/plant.png', {
    frameWidth: 96,
    frameHeight: 96,
  });
}

// 'self' is the Phaser scene we attach the animations to
function defineAnimations(self) {
  const walkAnimFrameRate = 10;

  self.anims.create({
    key: 'player-walk-down',
    frames: [
      ...self.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      { key: 'player', frame: 0 },
      ...self.anims.generateFrameNumbers('player', { start: 4, end: 6 }),
    ],
    frameRate: walkAnimFrameRate,
    repeat: -1,
  });

  self.anims.create({
    key: 'player-walk-left',
    frames: [
      ...self.anims.generateFrameNumbers('player', { start: 16, end: 19 }),
      { key: 'player', frame: 16 },
      ...self.anims.generateFrameNumbers('player', { start: 20, end: 22 }),
    ],
    frameRate: walkAnimFrameRate,
    repeat: -1,
  });

  self.anims.create({
    key: 'player-walk-up',
    frames: [
      ...self.anims.generateFrameNumbers('player', { start: 8, end: 11 }),
      { key: 'player', frame: 8 },
      ...self.anims.generateFrameNumbers('player', { start: 12, end: 14 }),
    ],
    frameRate: walkAnimFrameRate,
    repeat: -1,
  });

  self.anims.create({
    key: 'player-idle',
    frames: [{ key: 'player', frame: 0 }],
  });

  const plantAnimFrameRate = 5;

  self.anims.create({
    key: 'plant-alive',
    frames: self.anims.generateFrameNumbers('plant', { start: 0, end: 2 }),
    frameRate: plantAnimFrameRate,
    repeat: -1,
  });

  self.anims.create({
    key: 'plant-wilt',
    frames: self.anims.generateFrameNumbers('plant', { start: 3, end: 5 }),
    frameRate: plantAnimFrameRate,
    repeat: -1,
  });

  self.anims.create({
    key: 'plant-dead',
    frames: [{ key: 'plant', frame: 6 }],
  });
}

function create() {
  // Define animations
  defineAnimations(this);

  this.add.image(0, 0, 'background');

  const plants = this.physics.add.group({
    key: 'plant',
    repeat: 100,
  });

  plants.children.iterate((child) => {
    child.setX(Phaser.Math.Between(-1500, 1500));
    child.setY(Phaser.Math.Between(-1000, 1000));
    child.anims.play('plant-alive', false, Phaser.Math.Between(0, 2));
  });

  this.player = this.physics.add.sprite(0, 0, 'player-idle');
  const { player } = this;

  player.setCollideWorldBounds(true);

  this.physics.world.setBounds(-1500, -1000, 3000, 2000);

  this.cameras.main.setBounds(-1500, -1000, 3000, 2000);

  this.cameras.main.startFollow(player, true, 0.05, 0.05);
}

function update() {
  const { player } = this;
  const cursors = this.input.keyboard.createCursorKeys();

  const speed = 120;

  if (cursors.left.isDown) {
    player.setVelocityX(speed * -1);
    player.setVelocityY(0);
    player.anims.play('player-walk-left', true);
    player.flipX = false;
  } else if (cursors.right.isDown) {
    player.setVelocityX(speed);
    player.setVelocityY(0);
    player.anims.play('player-walk-left', true);
    player.flipX = true;
  } else if (cursors.down.isDown) {
    player.setVelocityY(speed);
    player.setVelocityX(0);
    player.anims.play('player-walk-down', true);
  } else if (cursors.up.isDown) {
    player.setVelocityY(speed * -1);
    player.setVelocityX(0);
    player.anims.play('player-walk-up', true);
  } else {
    player.setVelocityX(0);
    player.setVelocityY(0);
    player.anims.play('player-idle');
    // this.cameras.main.shake(500);
  }
}

// eslint-disable-next-line no-unused-vars
const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: 600,
  height: 450,
  physics: {
    default: 'arcade',
  },
  pixelArt: true,
  zoom: 1.5,
  scene: {
    preload,
    create,
    update,
  },
});
