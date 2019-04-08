import { LevelScene } from '@src/scenes';

export class FlyingText {
	public text: string;
	private scene: LevelScene;
	private paths: Phaser.Curves.Path[] = [];
	private letters: Phaser.GameObjects.Text[] = [];
	private offsets: number[];
	private isPlaying: boolean = false;
	private resolve: () => void;

	constructor({ text, scene }: { text?: string; scene: LevelScene }) {
		this.text = text || '';
		this.scene = scene;
	}

	public create({
		from,
		to,
		style,
		text
	}: {
		from: Vector2Like;
		to: Vector2Like;
		style: object;
		text?: string;
	}) {
		this.text = text || this.text;
		this.paths = [];
		this.letters = [];

		this.text.split('').forEach((char, index) => {
			const letter = this.scene.add
				.text(from.x, from.y, char, style)
				.setDepth(200)
				.setScale(0)
				.setScaleMode(Phaser.ScaleModes.NEAREST);
			this.letters.push(letter);

			const line = new Phaser.Curves.Line(
				new Phaser.Math.Vector2(from.x, from.y - 10),
				new Phaser.Math.Vector2(to.x + (letter.width + 10) * index, to.y)
			);
			const path = new Phaser.Curves.Path(from.x, from.y);
			path.add(line);
			this.paths.push(path);
		});
	}

	public update() {
		if (!this.isPlaying) return;
		this.offsets.forEach((value, index) => {
			if (value >= 1) return;
			const prevOffset = this.offsets[index - 1];
			if ((prevOffset && prevOffset > 0.1) || index === 0) {
				const newValue = Math.min(value + 0.007, 1);
				this.offsets[index] = newValue;
				const { x, y } = this.paths[index].getPoint(newValue);
				this.letters[index].setPosition(x, y).setScale(newValue);
			}
		});
		if (this.offsets[this.offsets.length - 1] >= 1) {
			this.isPlaying = false;
			this.resolve();
		}
	}

	public async show(): Promise<void> {
		if (!this.text) return;
		this.offsets = this.letters.map(() => 0);
		this.isPlaying = true;

		return new Promise(resolve => {
			this.resolve = resolve;
		});
	}
}
