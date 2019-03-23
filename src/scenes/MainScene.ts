const KeyCodes = Phaser.Input.Keyboard.KeyCodes;

export class MainScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'MainScene'
		});
	}

	public preload() {
		this.load.spritesheet('orly', 'assets/sprites/orly.png', {
			frameHeight: 102,
			frameWidth: 77
		});
	}

	public create() {
		const walkAnimation = this.anims.create({
			frameRate: 9,
			frames: this.anims.generateFrameNumbers('orly', { start: 1, end: 8 }),
			key: 'walk',
			repeat: -1
		});

		const sprite = this.add.sprite(400, 300, 'orly');
		sprite.anims.load('walk');
		sprite.anims.play('walk');
	}

	public update(time: number, delta: number) {}
}
