import 'phaser';

import { MainScene } from './scenes/MainScene';

const config: GameConfig = {
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: window.innerHeight,
	input: { keyboard: true },
	parent: 'game',
	physics: {
		arcade: {
			debug: false,
			gravity: { y: 1850 }
		},
		default: 'arcade'
	},
	scene: [MainScene],
	render: {
		pixelArt: true,
		roundPixels: true
	}
};

const game = new Phaser.Game(config);
