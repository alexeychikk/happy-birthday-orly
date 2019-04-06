import { LevelScene } from '@src/scenes';
import { LevelBackground } from './LevelBackground';

export class LevelMap {
	public platforms: Phaser.Tilemaps.DynamicTilemapLayer;
	public platformObjects: Phaser.Tilemaps.DynamicTilemapLayer;
	private startPosition: LevelObject;
	private objectsLayer: Phaser.Tilemaps.ObjectLayer;
	private scene: LevelScene;
	private map: Phaser.Tilemaps.Tilemap;
	private tiles: Phaser.Tilemaps.Tileset;
	private background: LevelBackground;
	private scaling: number = 3;

	constructor({ scene }: { scene: LevelScene }) {
		this.scene = scene;
		this.background = new LevelBackground({ scene });
	}

	public preload() {
		this.scene.load.image('tiles', 'assets/tilemaps/extruded.png');
		this.scene.load.tilemapTiledJSON('map', 'assets/tilemaps/base.json');
		this.background.preload();
	}

	public create() {
		this.scene.cameras.main.setBackgroundColor('#448AFF');
		this.map = this.scene.make.tilemap({ key: 'map' });
		this.tiles = this.map.addTilesetImage('atlas', 'tiles', 16, 16, 1, 2);
		this.platforms = this.createLayer('platforms');
		this.platforms.setDepth(50);
		this.platformObjects = this.createLayer('platform_objects');
		this.platformObjects.setDepth(45);
		this.background.create({
			width: this.platforms.displayWidth,
			height: this.platforms.displayHeight
		});
		this.objectsLayer = this.map.getObjectLayer('objects');
		this.startPosition = this.getObject('startPosition');
		this.scene.physics.world.setBounds(
			0,
			0,
			this.platforms.displayWidth,
			this.scene.height
		);
		this.scene.cameras.main.setBounds(
			0,
			0,
			this.platforms.displayWidth,
			this.scene.height
		);
	}

	public update() {
		this.background.update();
	}

	public getStartPosition(): Vector2Like {
		const { displayX, displayY } = this.startPosition;
		return { x: displayX, y: displayY };
	}

	private getObject(name: string): LevelObject {
		const obj = this.objectsLayer.objects.find(
			o => o.name === name
		) as LevelObject;

		obj.displayX = obj.x * this.scaling;
		obj.displayY =
			this.scene.height - this.platforms.displayHeight + obj.y * this.scaling;
		return obj;
	}

	private createLayer(name: string): Phaser.Tilemaps.DynamicTilemapLayer {
		const layer = this.map.createDynamicLayer(name, this.tiles, 0, 0);
		layer.setScale(this.scaling);
		layer.y = this.scene.height - layer.displayHeight;
		layer.setCollisionFromCollisionGroup();
		return layer;
	}
}
