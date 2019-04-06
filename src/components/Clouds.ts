import { LevelScene } from '@src/scenes';

export class Clouds {
	private scene: LevelScene;
	private platformClouds: Phaser.GameObjects.TileSprite;
	private skyCloudBig: Phaser.GameObjects.TileSprite;
	private map: Phaser.Tilemaps.Tilemap;

	constructor({ scene }: { scene: LevelScene }) {
		this.scene = scene;
	}

	public preload() {
		this.scene.load.image(
			'platform_clouds',
			'assets/tilemaps/platform_clouds.png'
		);
		this.scene.load.image('sky_cloud_big', 'assets/tilemaps/sky_cloud_big.png');
	}

	public create({ map }: { map: Phaser.Tilemaps.Tilemap }) {
		this.map = map;
		this.createPlatformClouds();
		this.createSkyCloudBig();
	}

	public update() {
		this.platformClouds.tilePositionX -= 0.1;
		this.skyCloudBig.tilePositionX -= 0.02;
	}

	private createPlatformClouds() {
		this.platformClouds = this.scene.add.tileSprite(
			0,
			0,
			0,
			0,
			'platform_clouds'
		);
		this.platformClouds.setOrigin(0, 0);
		this.platformClouds.setScale(2);
		this.platformClouds.width = this.map.widthInPixels;
		this.platformClouds.y =
			this.scene.height - this.platformClouds.displayHeight;
		this.platformClouds.setDepth(100);
	}

	private createSkyCloudBig() {
		this.skyCloudBig = this.scene.add.tileSprite(0, 0, 0, 0, 'sky_cloud_big');
		this.skyCloudBig.setOrigin(0, 0);
		this.skyCloudBig.setScale(2);
		this.skyCloudBig.width = this.map.widthInPixels;
		this.skyCloudBig.y = 100;
	}
}
