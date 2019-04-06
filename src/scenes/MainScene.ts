import { LevelMap } from '@src/components';
import { Player } from '@src/entities';
import { LevelScene } from './LevelScene';

export class MainScene extends LevelScene {
	public player: Player;
	private map: LevelMap;

	constructor() {
		super({
			key: 'MainScene'
		});

		this.player = new Player({ scene: this });
		this.map = new LevelMap({ scene: this });
	}

	public preload() {
		this.map.preload();
		this.player.preload();
	}

	public create() {
		this.map.create();
		this.player.create({ position: this.map.getStartPosition() });
		this.addColliders();
	}

	public update(time: number, delta: number) {
		this.map.update();
		this.player.update();
	}

	private addColliders() {
		this.physics.add.collider(this.map.platforms, this.player.sprite);
		this.physics.add.collider(this.map.platformObjects, this.player.sprite);
	}
}
