import { useState, useEffect, useCallback } from "react";
import { ToastContainer } from "react-toastify";
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
} from "matter-js";
import { useGameStore } from "store/game";
import { random } from "utils/random";
import { sleep } from "utils";
import { LinesType } from "./@types";
import { config, multiplier as multiplierValues } from "./config";
import MainLayout from "layouts/MainLayout";
import Panel from "./components/BetAction";
import GameBoard from "./components/GameBoard";
import styles from "./plinko.module.scss";
import { toast } from "react-toastify";

const Plinko = () => {
	const engine = Engine.create();
	const [lines, setLines] = useState<LinesType>(8);
	const [risk, setRisk] = useState<"Low" | "Mid" | "High">("Low");
	const inGameBallsCount = useGameStore((state) => state.gamesRunning);
	const incrementInGameBallsCount = useGameStore((state) => state.incrementGamesRunning);
	const decrementInGameBallsCount = useGameStore((state) => state.decrementGamesRunning);
	const { colors, engine: engineConfig, world: worldConfig, maxBallsCount } = config;
	const worldWidth: number = worldConfig.width;
	const worldHeight: number = worldConfig.height;

	const alertUser = (e: BeforeUnloadEvent) => {
		if (inGameBallsCount > 0) {
			e.preventDefault();
			alert("Do you really want to leave?");
			e.returnValue = "";
		}
	};

	useEffect(() => {
		window.addEventListener("beforeunload", alertUser);
		return () => {
			window.removeEventListener("beforeunload", alertUser);
		};
	}, [inGameBallsCount]); //eslint-disable-line

	useEffect(() => {
		engine.gravity.y = engineConfig.engineGravity;
		const element = document.getElementById("plinko");
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
				background: colors.background,
				hasBounds: true,
				width: worldWidth,
				height: worldHeight,
				wireframes: false,
			},
			engine,
		});
		const runner = Runner.create();
		Runner.run(runner, engine);
		Render.run(render);
		return () => {
			World.clear(engine.world, true);
			Engine.clear(engine);
			render.canvas.remove();
			render.textures = {};
		};
	}, [risk, lines]); //eslint-disable-line

	const pins: Body[] = [];

	const pinSize = 8 - lines / 4;

	const widthUnit = (worldWidth - pinSize * 2) / (lines * 2 + 2);
	const heightUnit = (worldHeight - pinSize * 2) / (lines + 1);
	for (let i = 0; i < lines; i++) {
		for (let j = lines - i - 1; j <= lines - i + (i + 2) * 2; j += 2) {
			const pin = Bodies.circle(
				widthUnit * j + pinSize,
				heightUnit * (i + 2) + pinSize,
				pinSize,
				{
					label: `pin-${i}`,
					render: {
						fillStyle: "#F5DCFF",
					},
					isStatic: true,
				}
			);
			pins.push(pin);
		}
	}

	const addInGameBall = () => {
		if (inGameBallsCount > maxBallsCount) return;
		incrementInGameBallsCount();
	};

	const removeInGameBall = () => {
		decrementInGameBallsCount();
	};

	const addBall = useCallback(
		(ballValue: number) => {
			addInGameBall();

			const minBallX = worldWidth / 2 + widthUnit;
			const maxBallX = worldWidth / 2 - widthUnit / 2;
			const ballX = random(minBallX, maxBallX);
			// const ballColor = ballValue <= 0 ? colors.text : colors.purple;
			const ballColor = colors.purple;
			const ball = Bodies.circle(ballX, 30, pinSize * 1.5, {
				restitution: 1,
				friction: 0.6,
				label: `ball-${ballValue}`,
				id: new Date().getTime(),
				frictionAir: 0.05,
				collisionFilter: {
					group: -1,
				},
				render: {
					fillStyle: ballColor,
				},
				isStatic: false,
			});
			Composite.add(engine.world, ball);
		},
		[risk, lines] //eslint-disable-line
	);

	const leftWall = Bodies.rectangle(
		worldWidth / 3 - 70,
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
	);
	const rightWall = Bodies.rectangle(
		worldWidth - 98,
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
	);
	const floor = Bodies.rectangle(0, worldWidth, worldWidth * 10, 1, {
		label: "block-1",
		render: {
			visible: false,
		},
		isStatic: true,
	});

	Composite.add(engine.world, [...pins, leftWall, rightWall, floor]);

	const bet = (betValue: number) => {
		addBall(betValue);
	};

	const onCollideWithMultiplier = async (ball: Body, multiplier: Body) => {
		ball.collisionFilter.group = 2;
		World.remove(engine.world, ball);
		removeInGameBall();
		const ballValue = ball.label.split("-")[1];
		const xPos = ball.position.x;
		const multiplierValue =
			multiplierValues[risk][lines / 4 - 2][
				Math.floor((xPos - pinSize * 3) / (widthUnit * 2))
			];
		console.log("Risk:", risk, "lines: ", lines);
		console.log("betValue:", ballValue, "multiplier:", multiplierValue);
		toast.success(
			<div style={{ color: "black", fontSize: "14px" }}>
				You earned ${((ballValue as any) * multiplierValue).toFixed(3)}
			</div>
		);

		if (+ballValue <= 0) return;
	};

	const onBodyCollision = async (event: IEventCollision<Engine>) => {
		const pairs = event.pairs;
		for (const pair of pairs) {
			const { bodyA, bodyB } = pair;
			if (bodyB.label.includes("ball") && bodyA.label.includes("block")) {
				// console.log(bodyA, bodyB)
				await onCollideWithMultiplier(bodyB, bodyA);
			}
		}
	};

	Events.on(engine, "collisionActive", onBodyCollision);

	return (
		<MainLayout title="PLINKO" className={styles.plinko}>
			<div className="plinko-container">
				<div className="game-box">
					<Panel
						inGameBallsCount={inGameBallsCount}
						onChangeLines={setLines}
						onRunBet={bet}
						onChangeRisk={setRisk}
					/>
					<div className="game-board">
						<GameBoard lines={lines} risk={risk} pinSize={pinSize} />
					</div>
				</div>
			</div>
			<ToastContainer
				position="top-right"
				autoClose={1000}
				hideProgressBar={true}
				newestOnTop={false}
				closeOnClick
				pauseOnHover={false}
				pauseOnFocusLoss={false}
				rtl={false}
				draggable
			/>
		</MainLayout>
	);
};

export default Plinko;
