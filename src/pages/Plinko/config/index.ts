import { colors } from "styles/colors";

const pins = {
	startPins: 3,
	pinSize: 3,
	pinGap: 20,
};

const ball = {
	ballSize: 5,
};

const engine = {
	engineGravity: 3,
};

const world = {
	width: 750,
	height: 750,
};

export const maxBallsCount = 100;

export const config = {
	pins,
	ball,
	engine,
	world,
	colors,
	maxBallsCount,
};

export const multiplier = {
	Low: [
		[5.6, 2.1, 1.1, 1, 0.5, 1, 1.1, 2.1, 5.6],
		[10, 3, 1.6, 1.4, 1.1, 1, 0.5, 1, 1.1, 1.4, 1.6, 3, 10],
		[16, 9, 2, 1.4, 1.4, 1.2, 1.1, 1, 0.5, 1, 1.1, 1.2, 1.4, 1.4, 2, 9, 16],
	],
	Mid: [
		[13, 3, 1.3, 0.7, 0.4, 0.7, 1.3, 3, 13],
		[33, 11, 4, 2, 1.1, 0.6, 0.3, 0.6, 1.1, 2, 4, 11, 33],
		[110, 41, 10, 5, 3, 1.5, 1, 0.5, 0.3, 0.5, 1, 1.5, 3, 5, 10, 41, 110],
	],
	High: [
		[29, 4, 1.5, 0.3, 0.2, 0.3, 1.5, 4, 29],
		[170, 24, 8.1, 2, 0.7, 0.2, 0.2, 0.2, 0.7, 1.2, 8, 24, 170],
		[1000, 130, 26, 9, 4, 2, 0.2, 0.2, 0.2, 0.2, 0.2, 2, 4, 9, 26, 130, 1000],
	],
};

export const color = [
	"#da2034",
	"#ea3347",
	"#ea3a41",
	"#eb463c",
	"#eb5739",
	"#ed6b37",
	"#f0963c",
	"#f3ac3e",
	"#f5c342",
];
