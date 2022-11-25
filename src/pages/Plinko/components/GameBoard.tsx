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
	const [bottom, setBottom] = useState(250);
	const boardRef = useRef<any>(null);
	const contentRef = useRef<any>(null);
	const resultRef = useRef<any>(null);
	useEffect(() => {
		const handleResize = () => {
			setDimentions({ width: window.innerWidth, height: window.innerHeight });
		};
		window.addEventListener("resize", handleResize);
		handleResize();
	}, []);

	useEffect(() => {
		// for (let i = 0; i < (resultRef.current.innerHTML.match(/<button/g) || []).length; i++)
		// 	resultRef.current.children[i].style.opacity = "1";
		setBottom((prev) => prev - 50);
	}, [multiplierHistory]);

	useEffect(() => {
		const width = dimentions.width;
		if (width >= 1000) {
			contentRef.current.style.scale = 1;
			boardRef.current.style.height = "auto";
			resultRef.current.style.scale = 1;
			resultRef.current.style.top = "50%";
		} else if (width < 1000 && width >= 424) {
			contentRef.current.style.scale = 0.6;
			boardRef.current.style.height = "380px";
			resultRef.current.style.scale = 0.6;
			resultRef.current.style.top = "20%";
		} else {
			contentRef.current.style.scale = (width - 24) / 660;
			boardRef.current.style.height = `${width - 24}px`;
			resultRef.current.style.scale = 0.6;
			resultRef.current.style.top = "20%";
		}
	}, [dimentions]);

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
			<div className="multiplier-history" ref={resultRef}>
				<div id="multi-container" style={{ bottom: `${bottom}px` }}>
					{multiplierHistory.map((multiplier, index) => {
						return (
							<button
								key={`${multiplier.mul}${index}${Math.random()}`}
								style={{
									backgroundColor: color[lines / 4 - 2][multiplier.index]?.bg,
									// opacity: index === 0 ? 0.2 : 1,
								}}
							>
								{multiplier.mul}x
							</button>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default GameBoard;
