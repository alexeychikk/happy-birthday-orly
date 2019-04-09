type PhParticles = Phaser.GameObjects.Particles.ParticleEmitterManager;

export abstract class LevelScene extends Phaser.Scene {
	public particles: { hearts: PhParticles };

	public preload() {
		this.load.image('heart', 'assets/sprites/heart.png');
	}

	public create() {
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
