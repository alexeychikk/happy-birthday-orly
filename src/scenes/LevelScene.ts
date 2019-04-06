export abstract class LevelScene extends Phaser.Scene {
	public get width(): number {
		return this.game.renderer.width;
	}

	public get height(): number {
		return this.game.renderer.height;
	}
}
