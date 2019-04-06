import { Player } from '@src/entities';
import { LevelScene } from '@src/scenes';

export class LevelMap {
	private scene: LevelScene;
	private map: Phaser.Tilemaps.Tilemap;
	private tiles: Phaser.Tilemaps.Tileset;

	private platforms: Phaser.Tilemaps.DynamicTilemapLayer;
	private objects: Phaser.Tilemaps.DynamicTilemapLayer;
	private clouds: Phaser.GameObjects.TileSprite;

	constructor({ scene }: { scene: LevelScene }) {
		this.scene = scene;
	}

	public preload() {
		this.scene.load.image('tiles', 'assets/tilemaps/extruded.png');
		this.scene.load.image('clouds', 'assets/tilemaps/clouds.png');
		this.scene.load.tilemapTiledJSON('map', 'assets/tilemaps/base.json');
	}

	public create({ player }: { player: Player }) {
		this.map = this.scene.make.tilemap({ key: 'map' });
		this.tiles = this.map.addTilesetImage('atlas', 'tiles', 16, 16, 1, 2);
		this.platforms = this.createLayer('platforms');
		this.platforms.setCollisionFromCollisionGroup();
		this.objects = this.createLayer('platform_objects');
		this.objects.setCollisionFromCollisionGroup();
		this.createClouds();
		this.scene.physics.world.setBounds(0, 0, this.map.width, this.scene.height);
		this.scene.cameras.main.setBounds(
			0,
			0,
			this.map.widthInPixels,
			this.scene.height
		);
		this.scene.physics.add.collider(this.platforms, player.sprite);
		this.scene.physics.add.collider(this.objects, player.sprite);
	}

	public update() {
		this.clouds.tilePositionX -= 0.1;
	}

	public get width(): number {
		return this.map.widthInPixels;
	}

	private createLayer(name: string): Phaser.Tilemaps.DynamicTilemapLayer {
		const layer = this.map.createDynamicLayer(name, this.tiles, 0, 0);
		layer.setScale(2.5);
		layer.y = this.scene.height - layer.displayHeight;
		return layer;
	}

	private createClouds() {
		this.createPlatformClouds();
	}

	private createPlatformClouds() {
		this.clouds = this.scene.add.tileSprite(0, 0, 0, 0, 'clouds');
		this.clouds.setOrigin(0, 0);
		this.clouds.setScale(2);
		this.clouds.width = this.width;
		this.clouds.y = this.scene.height - this.clouds.displayHeight;
	}
}
