import { LevelMap } from '@src/components';
import { Player } from '@src/entities';

export class MainScene extends Phaser.Scene {
	private player: Player;
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
		this.cameras.main.setBackgroundColor('#1e88e5');
		this.map.create();
		this.player.create({ position: { x: 300, y: 400 } });
	}

	public update(time: number, delta: number) {
		this.map.update();
		this.player.update();
	}
}
