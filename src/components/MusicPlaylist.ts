export class MusicPlaylist {
	private player: HTMLAudioElement;
	private playerSrc: HTMLSourceElement;
	private playlist: string[];
	private currentAudio: number = 0;

	constructor() {
		this.player = document.querySelector('#player') as HTMLAudioElement;
		this.playerSrc = document.querySelector('#player-src') as HTMLSourceElement;
		this.playlist = this.createPlaylist();

		this.player.addEventListener('ended', this.handleTrackEnded);
	}

	public play() {
		window.addEventListener('keydown', this.playOnUserInput);
		window.addEventListener('click', this.playOnUserInput);
		window.addEventListener('touchstart', this.playOnUserInput);
	}

	public pause() {
		this.player.pause();
	}

	public get src(): string {
		return this.playlist[this.currentAudio];
	}

	private playOnUserInput = () => {
		this.player.volume = 0.5;
		this.player.play().catch((err) => console.log(err));
		window.removeEventListener('keydown', this.playOnUserInput);
		window.removeEventListener('click', this.playOnUserInput);
		window.removeEventListener('touchstart', this.playOnUserInput);
	};

	private handleTrackEnded = () => {
		if (++this.currentAudio === this.playlist.length) this.currentAudio = 0;
		this.playerSrc.src = this.src;
		this.player.load();
		this.play();
	};

	private createPlaylist(): string[] {
		const arr = Array.from(
			document.querySelectorAll<HTMLLIElement>('#playlist [data-src]')
		).map((e) => e.dataset.src as string);
		arr.unshift(this.playerSrc.src);
		return arr;
	}
}
