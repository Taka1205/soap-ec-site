// src/data/images.ts
// public/image/ に置いた作品写真の一覧

export interface SoapImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const img = (name: string, alt: string, height: number): SoapImage => ({
  src: `/image/${name}.jpg`,
  alt,
  width: 869,
  height,
});

export const images = {
  blueButterflyBars: img('blue-butterfly-bars', '青い蝶をあしらった石鹸', 1088),
  blueRoseGradient: img('blue-rose-gradient', '青いバラを載せたグラデーションの石鹸', 1088),
  blueRoseWoodenBox: img('blue-rose-wooden-box', '木箱に並んだ青いバラの石鹸', 1048),
  blueStripeTulle: img('blue-stripe-tulle', '青と白のストライプの石鹸', 1089),
  giftBoxFlowerWreath: img('gift-box-flower-wreath', '花のリースをあしらった石鹸のギフトボックス', 1049),
  greenDaisy: img('green-daisy', 'デイジーを載せた緑の石鹸', 1086),
  greenFlowerTwine: img('green-flower-twine', '小花を載せた緑の石鹸', 1087),
  greenLeafCheck: img('green-leaf-check', '葉のモチーフと市松模様の石鹸', 1087),
  heartTinRainbow: img('heart-tin-rainbow', '缶に入ったハート形の石鹸', 1048),
  heartTopperBox: img('heart-topper-box', 'ハートを載せた石鹸の詰め合わせ', 1048),
  hydrangeaFlowerTiles: img('hydrangea-flower-tiles', '紫陽花をあしらった四角い石鹸', 1088),
  lavenderRound: img('lavender-round', 'ラベンダーを描いた丸い石鹸', 1048),
  macaronCubes: img('macaron-cubes', 'マカロンを載せた三色の石鹸', 1048),
  marbleWhiteRose: img('marble-white-rose', 'バラを載せたマーブル模様の石鹸', 1088),
  moonStarNight: img('moon-star-night', '月と星をあしらった夜空の石鹸', 1048),
  pastelDotCubes: img('pastel-dot-cubes', 'パステルの水玉を載せた小さな石鹸', 1048),
  pinkFlowerHeartPlate: img('pink-flower-heart-plate', 'ピンクの花を敷き詰めたハートの石鹸', 1087),
  pinkGinghamRose: img('pink-gingham-rose', 'バラを載せたピンクのギンガム柄の石鹸', 1087),
  pinkMarbleFlower: img('pink-marble-flower', '花を載せたピンクのマーブル模様の石鹸', 1087),
  pinkRibbonHeart: img('pink-ribbon-heart', 'リボンとハートをあしらった石鹸', 1089),
  pinkWhiteFlowerBars: img('pink-white-flower-bars', '白い花を載せたピンクの石鹸', 1088),
  polkaDotRoseRibbon: img('polka-dot-rose-ribbon', 'バラを載せた水玉模様の石鹸', 1089),
  purpleFlowerBars: img('purple-flower-bars', '紫の花を載せた白い石鹸', 1087),
  purpleFlowerTower: img('purple-flower-tower', '紫の花を載せた背の高い石鹸', 1048),
  purpleHydrangeaHeart: img('purple-hydrangea-heart', '紫陽花を敷き詰めたハート形の石鹸', 976),
  rainbowFlowerBar: img('rainbow-flower-bar', '虹色の小花を並べた石鹸', 1088),
  redRoseSquare: img('red-rose-square', '赤いバラで縁取った四角い石鹸', 1089),
  roseWreathRound: img('rose-wreath-round', 'バラのリースをあしらった丸い石鹸', 1088),
  seahorseBlue: img('seahorse-blue', 'タツノオトシゴを描いた青い石鹸', 1088),
  tropicalMonstera: img('tropical-monstera', 'モンステラとプルメリアを載せた石鹸', 1088),
  tulipCarvedGoldBox: img('tulip-carved-gold-box', '金の箱に入ったチューリップの石鹸', 1048),
  tulipRound: img('tulip-round', 'チューリップを載せた丸い石鹸', 1088),
} satisfies Record<string, SoapImage>;

export const allImages: SoapImage[] = Object.values(images);
