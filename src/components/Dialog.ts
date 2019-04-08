import { sleep } from '@src/utils';

export interface ILevelDialog {
	question: string;
	answers: string[];
	type?: string;
}

const DIALOGS: ILevelDialog[] = [
	{
		question: 'What is your name?',
		answers: ['orly', 'орли', 'אורלי']
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
		]
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
	private input: HTMLInputElement;
	private button: HTMLButtonElement;

	constructor() {
		this.container = document.querySelector('#dialog') as HTMLElement;
		this.text = document.querySelector('#dialog-text') as HTMLElement;
		this.input = document.querySelector('#dialog-input') as HTMLInputElement;
		this.button = document.querySelector('#dialog-button') as HTMLButtonElement;
	}

	public async openDialog(index: number): Promise<number | string | void> {
		if (!DIALOGS[index]) return;
		const { answers, question, type } = DIALOGS[index];
		this.text.innerHTML = question;
		this.input.value = '';

		await this.toggle(true);
		this.setupInput(type);
		this.input.focus();
		this.input.scrollIntoView();
		const answer = await this.waitForAnswer(answers, type);
		this.toggle(false);
		return answer;
	}

	public get isOpened(): boolean {
		return this.opened;
	}

	private setupInput(type?: string) {
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
		const addClass = visible ? 'visible' : 'hidden';
		const removeClass = visible ? 'hidden' : 'visible';
		this.container.classList.add(addClass);
		this.container.classList.remove(removeClass);
		this.opened = visible;
		await sleep(300);
	}

	private async waitForAnswer(
		answers: string[],
		type?: string
	): Promise<number | string> {
		return new Promise(resolve => {
			const handleInputKeypress = (e: KeyboardEvent) => {
				if (e.key.toLowerCase() !== 'enter') return;
				handleAnswer();
			};

			const handleAnswer = () => {
				const inputAnswer =
					type === 'number'
						? Math.min(Math.round(+this.input.value || 1), 100)
						: this.input.value.trim().toLowerCase();
				if (type === 'number' || answers.find(a => a === inputAnswer) != null) {
					this.button.removeEventListener('click', handleAnswer);
					this.input.removeEventListener('keypress', handleInputKeypress);
					resolve(inputAnswer);
				} else {
					this.button.classList.add('shake');
					setTimeout(() => this.button.classList.remove('shake'), 500);
				}
			};

			this.button.addEventListener('click', handleAnswer);
			this.input.addEventListener('keypress', handleInputKeypress);
		});
	}
}
