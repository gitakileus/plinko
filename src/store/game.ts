import create from 'zustand'

interface Game {
	gamesRunning: number
	balance: number
	incrementBalance: (val: number) => void
	setGamesRunning: (gamesRunning: number) => void
	incrementGamesRunning: () => void
	decrementGamesRunning: () => void
}

export const useGameStore = create<Game>((set, get) => ({
	gamesRunning: 0,
	balance: 100,
	setGamesRunning: (gamesRunning: number) => {
		set({ gamesRunning })
	},
	incrementBalance: (val: number) => {
		const balance = get().balance
		const calc = balance + val

		set({ balance: calc })
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
