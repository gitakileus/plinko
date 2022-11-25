import { useState, useEffect, useRef } from "react";
import { LinesType } from "../@types";
import { multiplier, color } from "../config";

type Props = {
	lines: LinesType;
	risk: "Low" | "Mid" | "High";
	pinSize: number;
	activeBlock: number;
	multiplierHistory: Record<any, any>[];
};

const GameBoard = ({
	lines,
	risk = "Low",
	pinSize,
	activeBlock,
	multiplierHistory,
}: Props) => {
	const [dimentions, setDimentions] = useState({
		width: 0,
		height: 0,
	});
	useEffect(() => {
		const handleResize = () => {
			setDimentions({ width: window.innerWidth, height: window.innerHeight });
		};
		window.addEventListener("resize", handleResize);
		handleResize();
	}, []);

	useEffect(() => {}, [dimentions]);
	const boardRef = useRef<any>(null);
	const contentRef = useRef<any>(null);

	return (
		<div className="game-board" ref={boardRef}>
			<div className="game-content" ref={contentRef}>
				<div
					id="plinko"
					style={{
						marginTop: `${lines === 8 ? -55 : lines === 12 ? -20 : -5}px`,
					}}
				/>
				<div
					className="multiplier-box"
					style={{
						gap: `${pinSize * 2}px`,
						paddingLeft: `${pinSize * 2}px`,
						paddingRight: `${pinSize * 2}px`,
					}}
				>
					{multiplier[risk][lines / 4 - 2].map((mul: number, index: number) => (
						<div
							style={{
								background: color[lines / 4 - 2][index].bg,
								boxShadow: `0px 3px 0px ${color[lines / 4 - 2][index].shadow}99`,
							}}
							key={String(mul) + String(index)}
							className={activeBlock === index ? "highlighted" : ""}
						>
							{mul}
							{mul < 100 ? "x" : ""}
						</div>
					))}
				</div>
			</div>
			<div className="multiplier-history">
				{multiplierHistory.map((multiplier, index) => {
					if (index > 3 || !multiplier) return null;
					return (
						<button
							key={`${multiplier.mul}${index}${Math.random()}`}
							style={{
								backgroundColor: color[lines / 4 - 2][multiplier.index]?.bg,
							}}
						>
							{multiplier.mul}x
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default GameBoard;
