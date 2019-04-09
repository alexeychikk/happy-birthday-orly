export type PhCursorKeys = Required<Phaser.Input.Keyboard.CursorKeys>;

export const getKeyPressDuration = (
	scene: Phaser.Scene,
	key: Phaser.Input.Keyboard.Key
) => {
	return scene.time.now - key.timeDown;
};

export const getCursorPressDuration = (
	scene: Phaser.Scene,
	cursors: PhCursorKeys,
	direction: keyof PhCursorKeys
) => {
	return getKeyPressDuration(scene, cursors[direction]);
};

export const isTouchDevice = (() => {
	const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
	if (
		'ontouchstart' in window ||
		((window as Window).DocumentTouch && document instanceof DocumentTouch)
	) {
		return true;
	}

	const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join(
		''
	);
	return (window as Window).matchMedia(query).matches;
})();
