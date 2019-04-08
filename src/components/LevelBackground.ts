import { LevelScene } from '@src/scenes';

export class LevelBackground {
	private scene: LevelScene;
	private cloudsBG: Phaser.GameObjects.TileSprite;
	private cloudsMG1: Phaser.GameObjects.TileSprite;
	private cloudsMG2: Phaser.GameObjects.TileSprite;
	private cloudsMG3: Phaser.GameObjects.TileSprite;
	private height: number;
	private width: number;

	constructor({ scene }: { scene: LevelScene }) {
		this.scene = scene;
	}

	public preload() {
		this.scene.load.image('mountains', 'assets/backgrounds/mountains.png');
		this.scene.load.image('clouds_BG', 'assets/backgrounds/clouds_BG.png');
		this.scene.load.image('clouds_MG_1', 'assets/backgrounds/clouds_MG_1.png');
		this.scene.load.image('clouds_MG_2', 'assets/backgrounds/clouds_MG_2.png');
		this.scene.load.image('clouds_MG_3', 'assets/backgrounds/clouds_MG_3.png');
	}

	public create({ width, height }: { width: number; height: number }) {
		this.width = width;
		this.height = height;
		this.createParallax();
	}

	public update() {
		this.cloudsBG.tilePositionX += 0.01;
		this.cloudsMG3.tilePositionX -= 0.02;
		this.cloudsMG2.tilePositionX -= 0.03;
		this.cloudsMG1.tilePositionX -= 0.05;
	}

	private createParallax() {
		this.cloudsBG = this.createTileSprite({
			depth: 2,
			name: 'clouds_BG',
			scrollFactor: 0.1,
			scale: 4
		});
		this.createTileSprite({
			depth: 3,
			name: 'mountains',
			scale: 4,
			scrollFactor: 0.15
		});
		this.cloudsMG3 = this.createTileSprite({
			depth: 4,
			name: 'clouds_MG_3',
			scrollFactor: 0.3,
			scale: 4
		});
		this.cloudsMG2 = this.createTileSprite({
			depth: 5,
			name: 'clouds_MG_2',
			scrollFactor: 0.4,
			scale: 4
		});
		this.cloudsMG1 = this.createTileSprite({
			depth: 6,
			name: 'clouds_MG_1',
			scrollFactor: 0.5,
			scale: 4
		});
	}

	private createTileSprite({
		name,
		depth,
		y,
		scrollFactor,
		scale = 2,
		width = this.width
	}: {
		name: string;
		scale?: number;
		depth?: number;
		y?: number;
		width?: number;
		scrollFactor?: number;
	}) {
		const tileSprite = this.scene.add.tileSprite(0, 0, 0, 0, name);
		tileSprite.setOrigin(0, 0);
		tileSprite.setScale(scale);
		tileSprite.width = width;
		tileSprite.y = y == null ? this.scene.height - tileSprite.displayHeight : y;
		if (scrollFactor != null) tileSprite.setScrollFactor(scrollFactor);
		if (depth != null) tileSprite.setDepth(depth);
		return tileSprite;
	}
}
