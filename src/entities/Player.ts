import { getCursorPressDuration, PhCursorKeys } from '../utils';

type PhAnimation = Phaser.Animations.Animation;
type PhSprite = Phaser.Physics.Arcade.Sprite & {
	body: Phaser.Physics.Arcade.Body;
};

enum PlayerState {
	standing,
	walking,
	sitting,
	jumping,
	falling
}

export class Player {
	private static readonly SPRITE = 'orly';
	private readonly scene: Phaser.Scene;
	private animations: {
		walk: PhAnimation;
		jump: PhAnimation;
		fall: PhAnimation;
	};
	private sprite: PhSprite;
	private cursors: PhCursorKeys;
	private movementSpeed: number = 250;
	private jumpPower: number = 550;
	private jumpVelocityX: number = 1;
	private jumpPressDuration: number = 300;

	constructor({ scene }: { scene: Phaser.Scene }) {
		this.scene = scene;
	}

	public preload(): void {
		this.scene.load.spritesheet(Player.SPRITE, 'assets/sprites/orly.png', {
			frameHeight: 102,
			frameWidth: 77
		});
	}

	public create(): void {
		this.createAnimations();
		this.createSprite();
		this.cursors = this.scene.input.keyboard.createCursorKeys() as PhCursorKeys;
	}

	public update(): void {
		this.fall();
		if (this.cursors.up.isDown && this.cursors.down.isUp) {
			this.jump();
		} else {
			this.endJump();
		}

		if (this.cursors.left.isDown || this.cursors.right.isDown) {
			this.walk();
		} else {
			this.stop();
		}
	}

	private walk(): void {
		const onFloor = this.sprite.body.onFloor();
		const walkingLeft = this.cursors.left.isDown;
		this.sprite.setVelocityX(this.getVelocity(walkingLeft));
		this.sprite.setFlipX(walkingLeft);

		if (
			this.sprite.state !== PlayerState.walking &&
			this.cursors.up.isUp &&
			onFloor
		) {
			this.sprite.setState(PlayerState.walking);
			this.sprite.anims.play(this.animations.walk.key);
		}
	}

	private getVelocity(walkingLeft: boolean): number {
		const onFloor = this.sprite.body.onFloor();
		const turnFactor = walkingLeft ? -1 : 1;

		if (onFloor) {
			return this.movementSpeed * turnFactor;
		}
		if (this.jumpVelocityX === 0) {
			return this.movementSpeed * turnFactor * this.getWalkFactor(walkingLeft);
		}

		const jumpingRight = this.jumpVelocityX > 0;
		const jumpFactor =
			(jumpingRight && !walkingLeft) || (!jumpingRight && walkingLeft)
				? 1
				: 0.4;
		return this.jumpVelocityX * jumpFactor * this.getWalkFactor(walkingLeft);
	}

	private getPressDuration(direction: keyof PhCursorKeys): number {
		return getCursorPressDuration(this.scene, this.cursors, direction);
	}

	private getWalkDuration(walkingLeft: boolean): number {
		return Math.min(
			this.jumpPressDuration,
			this.getPressDuration(walkingLeft ? 'left' : 'right')
		);
	}

	private getWalkFactor(walkingLeft: boolean): number {
		return this.getWalkDuration(walkingLeft) / this.jumpPressDuration;
	}

	private jump(): void {
		if (!this.sprite.body.onFloor()) return;

		this.jumpVelocityX = this.sprite.body.velocity.x;
		this.sprite.setVelocityY(-this.jumpPower);
		this.sprite.setState(PlayerState.jumping);
		this.sprite.anims.play(this.animations.jump.key);
	}

	private endJump(): void {
		const deltaY = this.sprite.body.deltaY();
		if (deltaY < 0 && this.sprite.body.velocity.y > -this.jumpPower / 1.5) {
			this.sprite.setVelocityY(0);
		}
	}

	private fall(): void {
		if (
			this.sprite.state !== PlayerState.falling &&
			!this.sprite.body.onFloor() &&
			this.sprite.body.deltaY() >= 0
		) {
			this.sprite.setState(PlayerState.falling);
			this.sprite.anims.play(this.animations.fall.key);
		}
	}

	private stop(): void {
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

	private createAnimations(): void {
		const walk = this.scene.anims.create({
			key: 'walk',
			frameRate: 13,
			frames: this.scene.anims.generateFrameNumbers(Player.SPRITE, {
				start: 1,
				end: 8
			}),
			repeat: -1
		}) as PhAnimation;

		const jump = this.scene.anims.create({
			key: 'jump',
			frameRate: 10,
			frames: this.scene.anims.generateFrameNumbers(Player.SPRITE, {
				start: 9,
				end: 12
			}),
			repeat: 0
		}) as PhAnimation;

		const fall = this.scene.anims.create({
			key: 'fall',
			frameRate: 10,
			frames: this.scene.anims.generateFrameNumbers(Player.SPRITE, {
				start: 13,
				end: 16
			}),
			repeat: 0
		}) as PhAnimation;

		this.animations = {
			walk,
			jump,
			fall
		};
	}

	private createSprite(): void {
		this.sprite = this.scene.physics.add.sprite(
			400,
			300,
			Player.SPRITE
		) as PhSprite;
		this.sprite.anims.load(this.animations.walk.key);
		this.sprite.anims.load(this.animations.jump.key);
		this.sprite.setCollideWorldBounds(true);
	}
}
