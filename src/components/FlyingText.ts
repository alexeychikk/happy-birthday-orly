import { LevelScene } from '@src/scenes';

export class FlyingText {
	public text: string;
	public style: object;
	private scene: LevelScene;
	private paths: Phaser.Curves.Path[] = [];
	private letters: Phaser.GameObjects.Text[] = [];
	private offsets: number[];
	private isPlaying: boolean = false;
	private resolve: () => void;
	private from: Vector2Like;
	private to: Vector2Like;
	private fullWidth: number;
	private spacing: number = 10;

	public constructor({
		scene,
		from,
		to,
		spacing,
		style,
		text
	}: {
		scene: LevelScene;
		from?: Vector2Like;
		to?: Vector2Like;
		spacing?: number;
		style: object;
		text: string;
	}) {
		this.scene = scene;
		this.text = text;
		this.style = style;
		this.spacing = spacing || this.spacing;

		this.tryCreateLetters(from);
		this.tryCreatePaths(to);
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

	public async show({
		from,
		to
	}: { from?: Vector2Like; to?: Vector2Like } = {}): Promise<void> {
		if (!this.text) return;
		this.offsets = this.letters.map(() => 0);
		this.tryCreateLetters(from);
		this.tryCreatePaths(to);
		this.isPlaying = true;

		return new Promise(resolve => {
			this.resolve = resolve;
		});
	}

	private tryCreateLetters(from?: Vector2Like) {
		if (from && this.from) {
			this.from = from;
			return this.repositionLetters();
		} else if (!from && this.from) return;

		this.from = from || this.from || { x: 0, y: 0 };
		this.createLetters();
	}

	private createLetters() {
		if (!this.from || !this.text) return;

		this.letters = [];
		this.text.split('').forEach(char => {
			const letter = this.scene.add
				.text(this.from.x, this.from.y, char, this.style)
				.setDepth(200)
				.setScale(0);
			this.letters.push(letter);
		});
		this.updateFullWidth();
	}

	private updateFullWidth() {
		this.fullWidth =
			this.letters.reduce(
				(width, letter) => width + letter.width + this.spacing,
				0
			) - this.spacing;
	}

	private repositionLetters() {
		this.letters.forEach(l => l.setPosition(this.from.x, this.from.y));
	}

	private tryCreatePaths(to?: Vector2Like) {
		if (!to) return;
		this.to = to;
		this.createPaths();
	}

	private createPaths() {
		if (!this.to) return;

		this.paths = [];

		this.letters.forEach((letter, index) => {
			const line = new Phaser.Curves.Line(
				new Phaser.Math.Vector2(this.from.x, this.from.y - 10),
				new Phaser.Math.Vector2(
					this.to.x - this.fullWidth / 2 + (letter.width + 10) * index,
					this.to.y - letter.height / 2
				)
			);
			const path = new Phaser.Curves.Path(this.from.x, this.from.y);
			path.add(line);
			this.paths.push(path);
		});
	}
}
