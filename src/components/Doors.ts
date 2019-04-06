import { LevelScene } from '@src/scenes';

export class Doors {
	private scene: LevelScene;

	constructor({ scene }: { scene: LevelScene }) {
		this.scene = scene;
	}

	public preload() {
		this.scene.load.spritesheet('door', 'assets/sprites/door.png', {
			frameHeight: 117,
			frameWidth: 54
		});
	}

	public create({ map }: { map: Phaser.Tilemaps.Tilemap }) {
		const [door] = map.createFromObjects('objects', 'door', {
			key: 'door'
		});
		door.setDepth(200);
	}

	public update() {}
}
