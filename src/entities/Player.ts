import { LevelScene } from '@src/scenes';
import { getCursorPressDuration, sleep } from '@src/utils';

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
	public sprite: PhSprite;
	private readonly scene: LevelScene;
	private animations: {
		walk: PhAnimation;
		jump: PhAnimation;
		fall: PhAnimation;
	};
	private spriteKey: string = 'orly';
	private movementSpeed: number = 300;
	private jumpPower: number = 670;
	private jumpVelocityX: number = 1;
	private jumpPressDuration: number = 300;
	private frozen: boolean = false;
	private dead: boolean = false;

	constructor({ scene }: { scene: LevelScene }) {
		this.scene = scene;
	}

	public preload(): void {
		this.scene.load.spritesheet(
			this.spriteKey,
			`assets/sprites/${this.spriteKey}.png`,
			{
				frameHeight: 102,
				frameWidth: 77,
				margin: 1,
				spacing: 2
			}
		);
	}

	public create({ position }: { position: Vector2Like }): void {
		this.createAnimations();
		this.createSprite(position);
	}

	public update(): void {
		this.applyControls();
		this.checkDeath();
	}

	public toggleFreeze(frozen: boolean) {
		this.frozen = frozen;
		this.stop();
	}

	private applyControls() {
		if (this.frozen) return;
		this.fall();
		if (this.scene.gameInput.pressingUp && !this.scene.gameInput.pressingDown) {
			this.jump();
		} else {
			this.endJump();
		}

		if (this.scene.gameInput.pressingLeftOrRight) {
			this.walk();
		} else {
			this.tryStop();
		}
	}

	private async checkDeath() {
		if (this.dead) return;
		if (this.sprite.y >= this.scene.height) {
			this.dead = true;
			this.scene.cameras.main.stopFollow();
			await sleep(100);
			await this.createDeathParticles();
			this.scene.scene.restart();
			this.dead = false;
		}
	}

	private async createDeathParticles() {
		this.scene.particles.hearts.setDepth(51).createEmitter({
			x: this.sprite.x,
			y: this.scene.height,
			speed: 500,
			gravityY: 1100,
			quantity: 5,
			maxParticles: 5,
			angle: { min: 230, max: 310 },
			lifespan: 1500
		});
		await sleep(1500);
	}

	private walk(): void {
		const onFloor = this.sprite.body.onFloor();
		const walkingLeft = this.scene.gameInput.pressingLeft;
		this.sprite.setVelocityX(this.getVelocity(walkingLeft));
		this.sprite.setFlipX(walkingLeft);

		if (
			this.sprite.state !== PlayerState.walking &&
			!this.scene.gameInput.pressingUp &&
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

	private getWalkDuration(walkingLeft: boolean): number {
		return Math.min(
			this.jumpPressDuration,
			this.scene.gameInput.getPressDuration(walkingLeft ? 'left' : 'right')
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
		if (
			this.sprite.body.deltaY() < 0 &&
			this.sprite.body.velocity.y > -this.jumpPower / 1.5
		) {
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
		this.sprite.anims.stop();
		this.sprite.setVelocityX(0);
		if (this.scene.gameInput.pressingDown) {
			this.sprite.setState(PlayerState.sitting);
			this.sprite.setFrame(17);
		} else {
			this.sprite.setState(PlayerState.standing);
			this.sprite.setFrame(0);
		}
	}

	private tryStop() {
		if (!this.sprite.body.onFloor() || this.scene.gameInput.pressingUp) return;
		this.stop();
	}

	private createAnimations(): void {
		const walk = this.scene.anims.create({
			key: Phaser.Math.RND.uuid(),
			frameRate: 14,
			frames: this.scene.anims.generateFrameNumbers(this.spriteKey, {
				start: 1,
				end: 8
			}),
			repeat: -1
		}) as PhAnimation;

		const jump = this.scene.anims.create({
			key: Phaser.Math.RND.uuid(),
			frameRate: 14,
			frames: this.scene.anims.generateFrameNumbers(this.spriteKey, {
				start: 9,
				end: 12
			}),
			repeat: 0
		}) as PhAnimation;

		const fall = this.scene.anims.create({
			key: Phaser.Math.RND.uuid(),
			frameRate: 14,
			frames: this.scene.anims.generateFrameNumbers(this.spriteKey, {
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

	private createSprite({ x, y }: Vector2Like): void {
		this.sprite = this.scene.physics.add.sprite(
			0,
			0,
			this.spriteKey
		) as PhSprite;
		this.sprite.setOrigin(0, 0);
		this.sprite.setPosition(x, y - this.sprite.displayHeight);
		this.sprite.anims.load(this.animations.walk.key);
		this.sprite.anims.load(this.animations.jump.key);
		this.sprite.body.width = 36;
		this.sprite.body.offset.x = 20;
		this.sprite.setDepth(48);
		this.scene.cameras.main.startFollow(this.sprite);
	}
}
