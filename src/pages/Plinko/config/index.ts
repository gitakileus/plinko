const engine = {
	engineGravity: 1.8,
}

const world = {
	width: 600,
	height: 600,
}

export const maxBallsCount = 100

export const config = {
	engine,
	world,
	maxBallsCount,
}

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
}

export const color = [
	[
		{ bg: '#ff003f', shadow: '#a60004' },
		{ bg: '#ff302f', shadow: '#a60000' },
		{ bg: '#ff6020', shadow: '#a80100' },
		{ bg: '#ff9010', shadow: '#aa4b00' },
		{ bg: '#ffc000', shadow: '#ab7900' },
		{ bg: '#ff9010', shadow: '#aa4b00' },
		{ bg: '#ff6020', shadow: '#a80100' },
		{ bg: '#ff302f', shadow: '#a60000' },
		{ bg: '#ff003f', shadow: '#a60004' },
	],
	[
		{ bg: '#ff003f', shadow: '#a60004' },
		{ bg: '#ff2035', shadow: '#a60000' },
		{ bg: '#ff402a', shadow: '#a60000' },
		{ bg: '#ff6020', shadow: '#a80100' },
		{ bg: '#ff8015', shadow: '#a93a00' },
		{ bg: '#ffa00b', shadow: '#aa5b00' },
		{ bg: '#ffc000', shadow: '#ab7900' },
		{ bg: '#ffa00b', shadow: '#aa5b00' },
		{ bg: '#ff8015', shadow: '#a93a00' },
		{ bg: '#ff6020', shadow: '#a80100' },
		{ bg: '#ff402a', shadow: '#a60000' },
		{ bg: '#ff2035', shadow: '#a60000' },
		{ bg: '#ff003f', shadow: '#a60004' },
	],
	[
		{ bg: '#ff003f', shadow: '#a60004' },
		{ bg: '#ff1837', shadow: '#a60000' },
		{ bg: '#ff302f', shadow: '#a60000' },
		{ bg: '#ff4827', shadow: '#a70000' },
		{ bg: '#ff6020', shadow: '#a80100' },
		{ bg: '#ff7818', shadow: '#a93000' },
		{ bg: '#ff9010', shadow: '#aa4b00' },
		{ bg: '#ffa808', shadow: '#aa6300' },
		{ bg: '#ffc000', shadow: '#ab7900' },
		{ bg: '#ffa808', shadow: '#aa6300' },
		{ bg: '#ff9010', shadow: '#aa4b00' },
		{ bg: '#ff7818', shadow: '#a93000' },
		{ bg: '#ff6020', shadow: '#a80100' },
		{ bg: '#ff4827', shadow: '#a70000' },
		{ bg: '#ff302f', shadow: '#a60000' },
		{ bg: '#ff1837', shadow: '#a60000' },
		{ bg: '#ff003f', shadow: '#a60004' },
	],
]
