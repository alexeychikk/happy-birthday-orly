declare type LevelObject = Phaser.GameObjects.GameObject &
	ParticleEmitterBounds & {
		displayX: number;
		displayY: number;
		displayWidth: number;
		displayHeight: number;
	};

declare var DocumentTouch: any;

interface Window {
	DocumentTouch: typeof DocumentTouch;
}
