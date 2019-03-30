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
