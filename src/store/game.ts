import create from 'zustand'

interface Game {
	gamesRunning: number
	balance: Record<string, number>
	currency: string
	incrementBalance: (val: number) => void
	setCurrency: (val: string) => void
	setGamesRunning: (gamesRunning: number) => void
	incrementGamesRunning: () => void
	decrementGamesRunning: () => void
}

export const useGameStore = create<Game>((set, get) => ({
	gamesRunning: 0,
	balance: { SOL: 100, USDC: 80 },
	currency: 'SOL',
	setGamesRunning: (gamesRunning: number) => {
		set({ gamesRunning })
	},
	incrementBalance: (val: number) => {
		const balance = get().balance
		const currency = get().currency
		let calc = balance
		calc[currency] = calc[currency] + val
		set({ balance: calc })
	},
	setCurrency: (currency: string) => {
		set({ currency })
	},
	incrementGamesRunning: () => {
		const gamesRunning = get().gamesRunning
		const calc = gamesRunning + 1
		set({ gamesRunning: calc < 0 ? 1 : calc })
	},
	decrementGamesRunning: () => {
		const gamesRunning = get().gamesRunning
		const calc = gamesRunning - 1
		set({ gamesRunning: calc < 0 ? 0 : calc })
	},
}))
