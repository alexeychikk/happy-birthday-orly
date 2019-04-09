import { GameInput } from '@src/components/GameInput';
import { InputUtils } from '@src/components/InputUtils';

type PhParticles = Phaser.GameObjects.Particles.ParticleEmitterManager;

export abstract class LevelScene extends Phaser.Scene {
	public particles: { hearts: PhParticles };
	public gameInput: GameInput;
	private inputUtils: InputUtils;

	constructor(...args: ConstructorParameters<typeof Phaser.Scene>) {
		super(...args);

		this.inputUtils = new InputUtils({ scene: this });
	}

	public preload() {
		this.load.image('heart', 'assets/sprites/heart.png');
	}

	public create() {
		this.gameInput = this.inputUtils.create();
		const hearts = this.add.particles('heart').setDepth(49);
		this.particles = { hearts };
	}

	public get width(): number {
		return this.game.renderer.width;
	}

	public get height(): number {
		return this.game.renderer.height;
	}
}
