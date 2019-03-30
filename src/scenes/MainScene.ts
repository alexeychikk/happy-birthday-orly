import { Player } from '../entities';

export class MainScene extends Phaser.Scene {
	private player: Player;

	constructor() {
		super({
			key: 'MainScene'
		});

		this.player = new Player({ scene: this });
	}

	public preload() {
		this.player.preload();
	}

	public create() {
		this.player.create();
	}

	public update(time: number, delta: number) {
		this.player.update();
	}
}
