import 'phaser';

import { MainScene } from './scenes/MainScene';

const config: GameConfig = {
	height: 1080,
	input: { keyboard: true },
	parent: 'game',
	physics: {
		arcade: {
			debug: false,
			gravity: { y: 500 }
		},
		default: 'arcade'
	},
	scene: [MainScene],
	type: Phaser.AUTO,
	width: 1920
};

const game = new Phaser.Game(config);
