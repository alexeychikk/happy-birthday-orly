import { LevelScene } from '@src/scenes';
import { sleep } from '@src/utils';
import { LevelSprite } from './Doors';

export class LoveChest {
	public sprite: LevelSprite;
	private scene: LevelScene;
	private animation: Phaser.Animations.Animation;
	private hearts: Phaser.GameObjects.Particles.ParticleEmitterManager;

	constructor({ scene }: { scene: LevelScene }) {
		this.scene = scene;
	}

	public preload() {
		this.scene.load.spritesheet('loveChest', 'assets/sprites/love_chest.png', {
			frameWidth: 64,
			frameHeight: 64
		});
		this.scene.load.image('heart', 'assets/sprites/heart.png');
	}

	public create({ sprite }: { sprite: LevelSprite }) {
		this.sprite = sprite;
		this.animation = this.scene.anims.create({
			key: Phaser.Math.RND.uuid(),
			frameRate: 20,
			frames: this.scene.anims.generateFrameNumbers('loveChest', {
				start: 0,
				end: 1
			}),
			repeat: 0
		}) as Phaser.Animations.Animation;
		sprite.anims.load(this.animation.key);

		this.hearts = this.scene.add.particles('heart');
		this.hearts.setDepth(49);
	}

	public update() {}

	public async open(giftsCount: number) {
		this.sprite.play(this.animation.key);
		this.sprite.body.checkCollision.none = true;
		await sleep(30);

		const { x, y } = this.sprite.getCenter();
		const frequency = Math.min(300, 5000 / giftsCount);
		const emitTime = frequency * giftsCount;
		const emitter = this.hearts.createEmitter({
			x: { min: x - 20, max: x + 20 },
			y: y - 20,
			speed: 300,
			gravityY: 600,
			frequency,
			quantity: 1,
			maxParticles: giftsCount,
			angle: { min: 230, max: 310 },
			lifespan: 7000,
			bounce: 0.5,
			bounds: {
				x: x - 400,
				y: this.sprite.y - 500 + this.sprite.displayHeight,
				w: 700,
				h: 500 - 16
			}
		});

		await sleep(emitTime + 500);
	}
}
