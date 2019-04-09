import { LevelScene } from '@src/scenes';
import { getCursorPressDuration, PhCursorKeys } from '@src/utils';

export class GameInput {
	private scene: LevelScene;
	private cursors: PhCursorKeys;

	constructor({ scene }: { scene: LevelScene }) {
		this.scene = scene;
		this.cursors = scene.input.keyboard.createCursorKeys() as PhCursorKeys;
	}

	public get pressingUp() {
		return (
			this.cursors.up.isDown ||
			(this.pointer.isDown && this.pointer.y < this.scene.height * 0.3)
		);
	}

	public get pressingDown() {
		return (
			this.cursors.down.isDown ||
			(this.pointer.isDown && this.pointer.y > this.scene.height * 0.7)
		);
	}

	public get pressingLeft() {
		return (
			this.cursors.left.isDown ||
			(this.pointer.isDown && this.pointer.x < this.scene.width * 0.3)
		);
	}

	public get pressingRight() {
		return (
			this.cursors.right.isDown ||
			(this.pointer.isDown && this.pointer.x > this.scene.width * 0.7)
		);
	}

	public get pressingLeftOrRight() {
		return this.pressingLeft || this.pressingRight;
	}

	public getPressDuration(direction: keyof PhCursorKeys): number {
		return getCursorPressDuration(this.scene, this.cursors, direction);
	}

	private get pointer() {
		return this.scene.input.activePointer;
	}
}
