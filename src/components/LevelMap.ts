import { Player } from '@src/entities';
import { LevelScene } from '@src/scenes';
import { Clouds } from './Clouds';

export class LevelMap {
	public platforms: Phaser.Tilemaps.DynamicTilemapLayer;
	public objects: Phaser.Tilemaps.DynamicTilemapLayer;
	private scene: LevelScene;
	private map: Phaser.Tilemaps.Tilemap;
	private tiles: Phaser.Tilemaps.Tileset;
	private clouds: Clouds;

	constructor({ scene }: { scene: LevelScene }) {
		this.scene = scene;
		this.clouds = new Clouds({ scene });
	}

	public preload() {
		this.scene.load.image('tiles', 'assets/tilemaps/extruded.png');
		this.scene.load.tilemapTiledJSON('map', 'assets/tilemaps/base.json');
		this.clouds.preload();
	}

	public create() {
		this.scene.cameras.main.setBackgroundColor('#448AFF');
		this.map = this.scene.make.tilemap({ key: 'map' });
		this.clouds.create({ map: this.map });
		this.tiles = this.map.addTilesetImage('atlas', 'tiles', 16, 16, 1, 2);
		this.platforms = this.createLayer('platforms');
		this.objects = this.createLayer('platform_objects');
		this.scene.physics.world.setBounds(
			0,
			0,
			this.map.widthInPixels,
			this.scene.height
		);
		this.scene.cameras.main.setBounds(
			0,
			0,
			this.map.widthInPixels,
			this.scene.height
		);
	}

	public update() {
		this.clouds.update();
	}

	private createLayer(name: string): Phaser.Tilemaps.DynamicTilemapLayer {
		const layer = this.map.createDynamicLayer(name, this.tiles, 0, 0);
		layer.setScale(2.5);
		layer.y = this.scene.height - layer.displayHeight;
		layer.setCollisionFromCollisionGroup();
		return layer;
	}
}
