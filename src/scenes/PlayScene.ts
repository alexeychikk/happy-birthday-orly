class TestScene extends Phaser.Scene {
  public player: Phaser.GameObjects.Sprite;
  public cursors: any;
  public map: Phaser.Tilemaps.Tilemap;
  public speed: number = 5;

  constructor() {
    super({
      key: "TestScene"
    });
  }

  public preload() {
    this.load.tilemapTiledJSON("map", "/assets/tilemaps/desert.json");
    this.load.image("Desert", "/assets/tilemaps/tmw_desert_spacing.png");
    this.load.image("player", "/assets/sprites/mushroom.png");
  }

  public create() {
    this.map = this.make.tilemap({ key: "map" });
    const tileset: Phaser.Tilemaps.Tileset = this.map.addTilesetImage("Desert");
    const layer: Phaser.Tilemaps.StaticTilemapLayer = this.map.createStaticLayer(
      0,
      tileset,
      0,
      0
    );

    this.player = this.add.sprite(100, 100, "player");
    this.cursors = this.input.keyboard.createCursorKeys();

    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.player, false);
  }

  public update(time: number, delta: number) {
    const { heightInPixels, widthInPixels } = this.map;
    const { height, width, x, y } = this.player;
    // this.player.angle += 1;
    if (this.cursors.left.isDown && x > 0) {
      this.player.x = Math.max(width / 2, x - this.speed);
    }
    if (this.cursors.right.isDown && x < widthInPixels) {
      this.player.x = Math.min(widthInPixels - width / 2, x + this.speed);
    }
    if (this.cursors.down.isDown && y < heightInPixels) {
      this.player.y = Math.min(heightInPixels - height / 2, y + this.speed);
    }
    if (this.cursors.up.isDown && y > 0) {
      this.player.y = Math.max(height / 2, y - this.speed);
    }
  }
}

export default TestScene;
