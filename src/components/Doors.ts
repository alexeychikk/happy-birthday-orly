import { LevelScene } from '@src/scenes';
import { LevelMap } from './LevelMap';
import { LoveChest } from './LoveChest';

type PhSprite = Phaser.Physics.Arcade.Sprite;

export enum DoorState {
	opened,
	closed
}

export type LevelSprite = PhSprite & {
	levelObject: LevelObject;
};

export class Doors {
	public sprites: LevelSprite[];
	public questionAreas: LevelSprite[];
	public loveChest: LoveChest;
	private scene: LevelScene;
	private level: LevelMap;
	private animation: Phaser.Animations.Animation;

	constructor({ scene }: { scene: LevelScene }) {
		this.scene = scene;
		this.loveChest = new LoveChest({ scene });
	}

	public preload() {
		this.scene.load.spritesheet('door', 'assets/sprites/door.png', {
			frameHeight: 141,
			frameWidth: 54
		});
		this.scene.load.spritesheet('question', 'assets/sprites/empty.png', {
			frameHeight: 8,
			frameWidth: 8
		});
		this.loveChest.preload();
	}

	public create({ level }: { level: LevelMap }) {
		this.level = level;
		this.createAnimations();
		this.createQuestions();
		this.createDoors();
		this.createLoveChest();
	}

	public update() {
		this.loveChest.update();
	}

	public openDoor(door: PhSprite) {
		if (door.state !== DoorState.closed) return;
		door.setState(DoorState.opened);
		door.play(this.animation.key);
		door.once('animationcomplete', () => {
			door.body.checkCollision.none = true;
		});
	}

	private createAnimations() {
		this.animation = this.scene.anims.create({
			key: Phaser.Math.RND.uuid(),
			frameRate: 9,
			frames: this.scene.anims.generateFrameNumbers('door', {
				start: 0,
				end: 2
			}),
			repeat: 0
		}) as Phaser.Animations.Animation;
	}

	private createSprites({
		objectName,
		spriteName,
		fn
	}: {
		objectName: string;
		spriteName?: string;
		fn?: (sprite: PhSprite, obj: LevelObject) => void;
	}): LevelSprite[] {
		const objects = this.level.getObjects(objectName);
		return objects.map(obj => {
			const sprite = this.scene.physics.add.staticSprite(
				0,
				0,
				spriteName === undefined ? objectName : spriteName
			) as LevelSprite;
			sprite.setOrigin(0, 0);
			sprite.x = obj.displayX;
			sprite.body.x = obj.displayX;
			const y =
				obj.displayHeight === 0
					? obj.displayY - sprite.displayHeight
					: obj.displayY;
			sprite.y = y;
			sprite.body.y = y;
			sprite.setDepth(46);
			sprite.levelObject = obj;
			if (fn) fn(sprite, obj);
			return sprite;
		});
	}

	private createDoors() {
		this.sprites = this.createSprites({
			objectName: 'door',
			fn: sprite => {
				sprite.anims.load(this.animation.key);
				sprite.setState(DoorState.closed);
			}
		});
	}

	private createQuestions() {
		this.questionAreas = this.createSprites({
			objectName: 'question',
			fn: (sprite, obj) => {
				sprite.body.width = obj.displayWidth;
				sprite.body.height = obj.displayHeight;
			}
		});
	}

	private createLoveChest() {
		const [sprite] = this.createSprites({
			objectName: 'loveChest'
		});
		this.loveChest.create({ sprite });
	}
}
