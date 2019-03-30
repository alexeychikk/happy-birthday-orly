import 'phaser';

import { MainScene } from './scenes/MainScene';

const config: GameConfig = {
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: 400,
	input: { keyboard: true },
	parent: 'game',
	physics: {
		arcade: {
			debug: false,
			gravity: { y: 1200 }
		},
		default: 'arcade'
	},
	scene: [MainScene]
};

const game = new Phaser.Game(config);
