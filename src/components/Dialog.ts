import { isTouchDevice, sleep, toggleVisibility } from '@src/utils';

export interface ILevelDialog {
	question: string;
	answers: string[];
	type?: string;
	hint?: string;
}

const DIALOGS: ILevelDialog[] = [
	{
		question: 'What is your name?',
		answers: ['orly', 'орли', 'אורלי'],
		hint: '(?) This game is made for my beloved girlfriend...'
	},
	{
		question:
			'Who is the best guy in the world?<br>' +
			'<span class="dialog-hint">(...he made this game)</span>',
		answers: [
			'alex',
			'alexey',
			'aleksey',
			'oleksii',
			'алекс',
			'алексей',
			'леша',
			'лёша',
			'лёшенька',
			'лешенька',
			'алёша',
			'alexeychikk',
			'אלכס',
			'אלכסיי'
		],
		hint: '(?) Come on, just look at the bottom of the screen!'
	},
	{
		question: 'How many gifts do you want for your birthday?',
		answers: [],
		type: 'number'
	}
];

export class Dialog {
	private opened: boolean = false;
	private container: HTMLElement;
	private text: HTMLElement;
	private hint: HTMLElement;
	private input: HTMLInputElement;
	private button: HTMLButtonElement;
	private currentDialog: ILevelDialog;

	private shakeTimeout: number;
	private hintTimeout: number;

	constructor() {
		this.container = document.querySelector('#dialog') as HTMLElement;
		this.text = document.querySelector('#dialog-text') as HTMLElement;
		this.hint = document.querySelector('#dialog-hint') as HTMLElement;
		this.input = document.querySelector('#dialog-input') as HTMLInputElement;
		this.button = document.querySelector('#dialog-button') as HTMLButtonElement;
	}

	public async openDialog(index: number): Promise<number | string | void> {
		if (!DIALOGS[index]) return;
		this.setupDialog(DIALOGS[index]);

		await this.toggle(true);
		this.setupInput();
		if (!isTouchDevice) this.input.focus();
		this.input.scrollIntoView();
		const answer = await this.waitForAnswer();
		if (isTouchDevice) {
			this.input.blur();
			await sleep(500);
		}
		this.toggle(false);
		return answer;
	}

	public get isOpened(): boolean {
		return this.opened;
	}

	private setupDialog(dialog: ILevelDialog) {
		this.currentDialog = dialog;
		this.text.innerHTML = dialog.question;
		this.hint.innerHTML = dialog.hint || '';
		this.input.value = '';
	}

	private setupInput() {
		const { type } = this.currentDialog;
		if (type === 'number') {
			this.input.type = type;
			this.input.min = '1';
			this.input.max = '100';
			this.input.step = '1';
			this.input.maxLength = 3;
		} else {
			this.input.maxLength = 16;
			this.input.type = 'text';
		}
	}

	private async toggle(visible: boolean) {
		this.opened = visible;
		await toggleVisibility(this.container, visible);
	}

	private async waitForAnswer(): Promise<number | string> {
		return new Promise(resolve => {
			const handleInputKeypress = (e: KeyboardEvent) => {
				if (e.key.toLowerCase() !== 'enter') return;
				handleAnswer();
			};

			const handleAnswer = () => {
				const inputAnswer = this.getAnswer();
				if (this.answerIsCorrect(inputAnswer)) {
					this.button.removeEventListener('click', handleAnswer);
					this.input.removeEventListener('keypress', handleInputKeypress);
					this.clearShakeButton();
					this.hideHint();
					resolve(inputAnswer);
				} else {
					this.warnWrongAnswer();
				}
			};

			this.button.addEventListener('click', handleAnswer);
			this.input.addEventListener('keypress', handleInputKeypress);
		});
	}

	private getAnswer(): string | number {
		return this.currentDialog.type === 'number'
			? Math.min(Math.round(+this.input.value || 1), 100)
			: this.input.value.trim().toLowerCase();
	}

	private answerIsCorrect(
		inputAnswer: string | number = this.getAnswer()
	): boolean {
		return (
			this.currentDialog.type === 'number' ||
			this.currentDialog.answers.find(a => a === inputAnswer) != null
		);
	}

	private warnWrongAnswer() {
		this.shakeButton();
		this.showHint();
	}

	private shakeButton() {
		if (this.shakeTimeout) return;
		this.button.classList.add('shake');
		this.shakeTimeout = window.setTimeout(() => this.clearShakeButton(), 500);
	}

	private clearShakeButton() {
		if (!this.shakeTimeout) return;
		window.clearTimeout(this.shakeTimeout);
		this.shakeTimeout = 0;
		this.button.classList.remove('shake');
	}

	private showHint() {
		if (!this.hint || this.hintTimeout) return;
		this.hintTimeout = window.setTimeout(() => {
			toggleVisibility(this.hint, true);
			this.hintTimeout = 0;
		}, 1500);
	}

	private hideHint() {
		window.clearTimeout(this.hintTimeout);
		this.hintTimeout = 0;
		toggleVisibility(this.hint, false);
	}
}
