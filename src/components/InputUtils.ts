import { LevelScene } from '@src/scenes';
import { GameInput } from './GameInput';

export class InputUtils {
	private scene: LevelScene;

	constructor({ scene }: { scene: LevelScene }) {
		this.scene = scene;
	}

	public create(): GameInput {
		return new GameInput({ scene: this.scene });
	}
}
