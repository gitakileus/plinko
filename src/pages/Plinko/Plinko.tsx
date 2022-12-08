import { useState, useEffect, useCallback, useRef } from 'react'
import { ToastContainer } from 'react-toastify'
import {
	Bodies,
	Body,
	Composite,
	Engine,
	Events,
	IEventCollision,
	Render,
	Runner,
	World,
} from 'matter-js'
import axios from 'axios'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import queryString from 'query-string'
import { isMobile } from 'react-device-detect'
import { useGameStore } from 'store/game'
import { random } from 'utils/random'
import { LinesType, RiskType } from './@types'
import { config, multiplier as multiplierValues } from './config'
import MainLayout from 'layouts/MainLayout'
import Panel from './components/BetAction'
import GameBoard from './components/GameBoard'
import styles from './plinko.module.scss'
// import BallAudio from 'assets/sounds/ball.wav'
// import MultiplierLowAudio from 'assets/sounds/multiplier-low.wav'
// import MultiplierRegularAudio from 'assets/sounds/multiplier-regular.wav'
// import MultiplierGoodAudio from 'assets/sounds/multiplier-good.wav'
// import MultiplierBestAudio from 'assets/sounds/multiplier-best.wav'

const Plinko = () => {
	const engine = Engine.create()
	const [isAuto, setIsAuto] = useState<boolean>(false)
	const [lines, setLines] = useState<LinesType>(8)
	const [risk, setRisk] = useState<RiskType>('Low')
	const inGameBallsCount = useGameStore((state) => state.gamesRunning)
	const [activeBlock, setActiveBlock] = useState(-1)
	const [autoBallCount, setAutoBallCount] = useState<number>(1)
	const [lastMultipliers, setLastMultipliers] = useState<Record<any, any>[]>([])
	const incrementInGameBallsCount = useGameStore((state) => state.incrementGamesRunning)
	const decrementInGameBallsCount = useGameStore((state) => state.decrementGamesRunning)
	const { engine: engineConfig, world: worldConfig, maxBallsCount } = config
	const worldWidth: number = worldConfig.width
	const worldHeight: number = worldConfig.height
	const incrementBalance = useGameStore((state) => state.incrementBalance)
	const [leftBallCount, setLeftBallCount] = useState<number>(0)
	const [muted, setMuted] = useState<boolean>(
		localStorage.getItem('muted') === 'true' ? true : false
	)
	const muteRef = useRef<any>(null)
	muteRef.current = muted
	const [option, setOption] = useState<number>(0)
	const soundRef = useRef<any>(null)
	soundRef.current = option
	const [confettiRunning, setConfettiRunning] = useState<number>(0)
	const { width, height } = useWindowSize()

	useEffect(() => {
		const queryParams = queryString.parse(window.location.search)
		if (
			queryParams.option !== undefined &&
			queryParams.option !== null &&
			queryParams.option >= '1' &&
			queryParams.option <= '4'
		) {
			setOption(+queryParams.option)
		}
	}, [])

	// const ballSound = new Audio()
	// ballSound.src = 'sounds/dot_4.wav'
	// ballSound.volume = 0.2

	// const multiplierSound = new Audio()
	// multiplierSound.src = 'sounds/reach_2.wav'
	// multiplierSound.volume = 0.2

	const alertUser = (e: BeforeUnloadEvent) => {
		if (inGameBallsCount > 0) {
			e.preventDefault()
			alert('Do you really want to leave?')
			e.returnValue = ''
		}
	}

	useEffect(() => {
		window.addEventListener('beforeunload', alertUser)
		return () => {
			window.removeEventListener('beforeunload', alertUser)
		}
	}, [inGameBallsCount]) //eslint-disable-line

	useEffect(() => {
		engine.gravity.y = isMobile
			? engineConfig.engineGravity * 2
			: engineConfig.engineGravity
		// engine.gravity.y = engineConfig.engineGravity
		const element = document.getElementById('plinko')
		const render = Render.create({
			element: element!,
			bounds: {
				max: {
					x: worldWidth,
					y: worldHeight,
				},
				min: {
					x: 0,
					y: 0,
				},
			},
			options: {
				background: '#14111F',
				hasBounds: true,
				width: worldWidth,
				height: worldHeight,
				wireframes: false,
			},
			engine,
		})
		const runner = Runner.create()
		Runner.run(runner, engine)
		Render.run(render)
		return () => {
			World.clear(engine.world, true)
			Engine.clear(engine)
			render.canvas.remove()
			render.textures = {}
		}
	}, [risk, lines]) //eslint-disable-line

	const pins: Body[] = []

	const pinSize = 8 - lines / 4 + (lines === 8 ? 1.2 : 0)
	const widthUnit = (worldWidth - pinSize * 2) / (lines * 2 + 2)
	const heightUnit = (worldHeight - pinSize * 2) / (lines + 1)

	for (let i = 0; i < lines; i++) {
		for (let j = lines - i - 1; j <= lines - i + (i + 2) * 2; j += 2) {
			const pin = Bodies.circle(
				widthUnit * j + pinSize,
				heightUnit * (i + 2) + pinSize - 20,
				pinSize,
				{
					label: `pin-${i}`,
					render: {
						fillStyle: '#CABAFF',
					},
					isStatic: true,
				}
			)
			pins.push(pin)
		}
	}

	const addInGameBall = () => {
		if (inGameBallsCount > maxBallsCount) return
		incrementInGameBallsCount()
	}

	const removeInGameBall = () => {
		decrementInGameBallsCount()
	}

	const addBall = useCallback(
		(ballValue: number) => {
			addInGameBall()

			const minBallX = worldWidth / 2 + widthUnit
			const maxBallX = worldWidth / 2 - widthUnit
			const ballX = random(minBallX, maxBallX)
			const ballColor = '#ff9010'
			const ball = Bodies.circle(ballX, heightUnit, pinSize * 1.8, {
				restitution: 1,
				friction: 0.6,
				label: `ball-${ballValue}-${ballX}`,
				id: new Date().getTime(),
				frictionAir: 0.05,
				collisionFilter: {
					group: -1,
				},
				render: {
					fillStyle: ballColor,
				},
				isStatic: false,
			})
			Composite.add(engine.world, ball)
		},
		[risk, lines] //eslint-disable-line
	)

	const leftWall = Bodies.rectangle(
		worldWidth / 3 - 75,
		worldWidth / 2 - 2,
		worldWidth * 2,
		40,
		{
			angle: 90,
			render: {
				visible: false,
			},
			isStatic: true,
		}
	)
	const rightWall = Bodies.rectangle(
		worldWidth - 125,
		worldWidth / 2 - 2,
		worldWidth * 2,
		40,
		{
			angle: -90,
			render: {
				visible: false,
			},
			isStatic: true,
		}
	)
	const floor = Bodies.rectangle(0, worldWidth + 1, worldWidth * 10, 30, {
		label: 'block-1',
		render: {
			visible: false,
		},
		isStatic: true,
	})

	Composite.add(engine.world, [...pins, leftWall, rightWall, floor])

	const bet = (betValue: number) => {
		setLeftBallCount((prev) => prev - 1)
		addBall(betValue)
	}

	const onCollideWithMultiplier = async (ball: Body, multiplier: Body) => {
		ball.collisionFilter.group = 2
		World.remove(engine.world, ball)
		removeInGameBall()
		const ballValue = ball.label.split('-')[1]
		const startPos = ball.label.split('-')[2]
		const xPos = ball.position.x
		const target = Math.floor((xPos - pinSize) / (widthUnit * 2))

		if (!muteRef.current) {
			const multiplierSound = new Audio()
			multiplierSound.autoplay = true

			multiplierSound.src = 'sounds/reach_2.wav'
			multiplierSound.volume = 0.2

			multiplierSound.remove()
		}
		const multiplierValue = multiplierValues[risk][lines / 4 - 2][target]
		setActiveBlock(-1)
		setTimeout(() => {
			setActiveBlock(target)
		}, 5)
		console.log('Risk:', risk, 'lines: ', lines)
		console.log('betValue:', ballValue, 'multiplier:', multiplierValue)
		incrementBalance(+ballValue * multiplierValue)
		setLastMultipliers((prev) => [{ mul: multiplierValue, index: target }, ...prev])
		// await axios.post('http://localhost:8080/makeArray', {
		// 	line: lines,
		// 	xpos: startPos,
		// 	target: target,
		// })
		if (multiplierValue >= 2.1) {
			setConfettiRunning(200)
			setTimeout(() => {
				setConfettiRunning(0)
			}, 1000)
		}
	}

	const onBodyCollision = async (event: IEventCollision<Engine>) => {
		const pairs = event.pairs
		for (const pair of pairs) {
			const { bodyA, bodyB } = pair
			if (bodyB.label.includes('ball') && bodyA.label.includes('block')) {
				onCollideWithMultiplier(bodyB, bodyA)
			}
		}
	}

	const onBounceCollision = async (event: IEventCollision<Engine>) => {
		if (!muteRef.current) {
			const ballSound = new Audio()
			ballSound.autoplay = true
			switch (soundRef.current) {
				case 1:
					ballSound.src = 'sounds/dot_7.mp3'
					break
				case 2:
					ballSound.src = 'sounds/dot_4_shorter.mp3'
					break
				case 3:
					ballSound.src = 'sounds/dot_4.wav'
					break
				case 4:
					ballSound.src = 'sounds/dot_2.mp3'
					break
				default:
					ballSound.src = 'sounds/dot_6.mp3'
			}
			ballSound.volume = 0.2
			ballSound.remove()
		}

		const pairs = event.pairs
		for (const pair of pairs) {
			const { bodyA, bodyB } = pair
			if (bodyB.label.includes('ball') && bodyA.label.includes('pin')) {
				const xPos = bodyA.position.x
				const yPos = bodyA.position.y
				let radius = pinSize
				let bounceEffect: any = null
				let bounceTimer = setInterval(() => {
					bounceEffect !== null && World.remove(engine.world, bounceEffect)
					bounceEffect = Bodies.circle(xPos, yPos, radius, {
						collisionFilter: { group: -1 },
						render: {
							fillStyle: '#fff3',
						},
						isStatic: true,
					})
					Composite.add(engine.world, bounceEffect)
					radius = radius + pinSize / 8
					if (radius > pinSize * 3) {
						World.remove(engine.world, bounceEffect)
						clearInterval(bounceTimer)
					}
				}, 5)
			}
		}
	}

	Events.on(engine, 'collisionStart', onBodyCollision)
	Events.on(engine, 'collisionStart', onBounceCollision)

	const handleSetMuted = () => {
		localStorage.setItem('muted', muted === true ? 'false' : 'true')
		setMuted((prev) => !prev)
	}

	return (
		<MainLayout title="Play Blinko" className={styles.plinko}>
			<div className="plinko-container">
				<div className="game-box">
					<Panel
						inGameBallsCount={inGameBallsCount}
						onChangeLines={setLines}
						onRunBet={bet}
						onChangeRisk={setRisk}
						autoBallCount={autoBallCount}
						onChangeAutoBallCount={setAutoBallCount}
						isAuto={isAuto}
						onChangeIsAuto={setIsAuto}
						leftBallCount={leftBallCount}
						onChangeLeftBallCount={setLeftBallCount}
						muted={muted}
						onChangeMuted={handleSetMuted}
					/>
					<GameBoard
						lines={lines}
						risk={risk}
						pinSize={pinSize}
						activeBlock={activeBlock}
						multiplierHistory={lastMultipliers}
						leftBallCount={leftBallCount}
						isAuto={isAuto}
					/>
				</div>
			</div>
			<ToastContainer
				position="top-right"
				autoClose={500}
				hideProgressBar={true}
				newestOnTop={false}
				closeOnClick
				pauseOnHover={false}
				pauseOnFocusLoss={false}
				rtl={false}
				draggable
			/>
			<Confetti
				width={width}
				height={height}
				gravity={0.3}
				numberOfPieces={confettiRunning}
			/>
		</MainLayout>
	)
}

export default Plinko
