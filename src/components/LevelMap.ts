export class LevelMap {
	private scene: Phaser.Scene;
	private map: Phaser.Tilemaps.Tilemap;
	private tiles: Phaser.Tilemaps.Tileset;

	private layerPlatforms: Phaser.Tilemaps.DynamicTilemapLayer;
	private layerPlatformObjects: Phaser.Tilemaps.DynamicTilemapLayer;
	private clouds: Phaser.GameObjects.TileSprite;

	constructor({ scene }: { scene: Phaser.Scene }) {
		this.scene = scene;
	}

	public preload() {
		this.scene.load.image('tiles', 'assets/tilemaps/atlas.png');
		this.scene.load.image('clouds', 'assets/tilemaps/clouds.png');
		this.scene.load.tilemapTiledJSON('map', 'assets/tilemaps/base.json');
	}

	public create() {
		this.map = this.scene.make.tilemap({ key: 'map' });
		this.tiles = this.map.addTilesetImage('atlas', 'tiles', 16, 16);
		this.layerPlatforms = this.map.createDynamicLayer(
			'platforms',
			this.tiles,
			0,
			0
		);
		this.layerPlatformObjects = this.map.createDynamicLayer(
			'platform_objects',
			this.tiles,
			0,
			0
		);
		this.clouds = this.scene.add.tileSprite(0, 0, 0, 0, 'clouds');
		this.clouds.width = window.innerWidth;
		this.clouds.x = this.clouds.width / 2;
		this.clouds.y = this.map.heightInPixels - this.clouds.height / 2;
	}

	public update() {
		this.clouds.tilePositionX -= 0.2;
	}
}
