type PhAnimation = Phaser.Animations.Animation;
type PhSprite = Phaser.Physics.Arcade.Sprite & {
	body: Phaser.Physics.Arcade.Body;
};
type PhCursorKeys = Required<Phaser.Input.Keyboard.CursorKeys>;

enum PlayerState {
	standing,
	walking,
	sitting,
	jumping
}

export class Player {
	private static readonly SPRITE = 'orly';
	private readonly scene: Phaser.Scene;
	private readonly animations: { [key: string]: PhAnimation } = {};
	private sprite: PhSprite;
	private cursors: PhCursorKeys;
	private movementSpeed: number = 250;
	private jumpPower: number = 500;

	constructor({ scene }: { scene: Phaser.Scene }) {
		this.scene = scene;
	}

	public preload() {
		this.scene.load.spritesheet(Player.SPRITE, 'assets/sprites/orly.png', {
			frameHeight: 102,
			frameWidth: 77
		});
	}

	public create() {
		this.createAnimations();
		this.createSprite();
		this.cursors = this.scene.input.keyboard.createCursorKeys() as PhCursorKeys;
	}

	public update() {
		if (this.cursors.up.isDown && this.cursors.down.isUp) {
			this.jump();
		}

		if (this.cursors.left.isDown) {
			this.walk(true);
		} else if (this.cursors.right.isDown) {
			this.walk(false);
		} else {
			this.stop();
		}
	}

	private walk(turnLeft: boolean) {
		this.sprite.setVelocityX(this.movementSpeed * (turnLeft ? -1 : 1));
		this.sprite.setFlipX(turnLeft);

		if (
			this.sprite.state !== PlayerState.walking &&
			this.cursors.up.isUp &&
			this.sprite.body.onFloor()
		) {
			this.sprite.setState(PlayerState.walking);
			this.sprite.anims.play(this.animations.walk.key);
		}
	}

	private jump() {
		if (!this.sprite.body.onFloor()) return;
		this.sprite.setState(PlayerState.jumping);
		this.sprite.setVelocityY(-this.jumpPower);
		this.sprite.anims.play(this.animations.jump.key);
	}

	private stop() {
		if (!this.sprite.body.onFloor() || this.cursors.up.isDown) return;
		this.sprite.anims.stop();
		this.sprite.setVelocityX(0);
		if (this.cursors.down.isDown) {
			this.sprite.setState(PlayerState.sitting);
			this.sprite.setFrame(17);
		} else {
			this.sprite.setState(PlayerState.standing);
			this.sprite.setFrame(0);
		}
	}

	private createAnimations() {
		this.animations.walk = this.scene.anims.create({
			key: 'walk',
			frameRate: 9,
			frames: this.scene.anims.generateFrameNumbers(Player.SPRITE, {
				start: 1,
				end: 8
			}),
			repeat: -1
		}) as PhAnimation;

		this.animations.jump = this.scene.anims.create({
			key: 'jump',
			frameRate: 10,
			frames: this.scene.anims.generateFrameNumbers(Player.SPRITE, {
				start: 9,
				end: 16
			}),
			repeat: 0
		}) as PhAnimation;
	}

	private createSprite() {
		this.sprite = this.scene.physics.add.sprite(
			400,
			300,
			Player.SPRITE
		) as PhSprite;
		this.sprite.anims.load(this.animations.walk.key);
		this.sprite.anims.load(this.animations.jump.key);
		this.sprite.setBounce(0.1);
		this.sprite.setCollideWorldBounds(true);
	}
}
