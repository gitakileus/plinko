import { useState, useEffect, useRef } from "react";
import { LinesType } from "../@types";
import { multiplier, color } from "../config";

type Props = {
	lines: LinesType;
	risk: "Low" | "Mid" | "High";
	pinSize: number;
	activeBlock: number;
};

const GameBoard = ({ lines, risk = "Low", pinSize, activeBlock }: Props) => {
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

	useEffect(() => {
		if (dimentions.width >= 1080) {
			contentRef.current.style.scale = 1;
			boardRef.current.style.maxHeight = "none";
			return;
		}
		contentRef.current.style.scale = 0.7;
		console.log(contentRef.current.clientHeight);
		boardRef.current.style.maxHeight = `${contentRef.current.clientHeight * 0.6}px`;
		// boardRef.current.style.maxHeight = `${dimentions.width * 0.9}px`;
		if (dimentions.width < 600) {
			contentRef.current.style.scale = (dimentions.width - 80) / 750;
			boardRef.current.style.maxHeight = `${
				contentRef.current.clientHeight * ((dimentions.width - 80) / 750)
			}px`;
		}
	}, [dimentions]);
	const boardRef = useRef<any>(null);
	const contentRef = useRef<any>(null);

	return (
		<div className="game-board" ref={boardRef}>
			<div
				className="game-content"
				ref={contentRef}
				style={{
					marginTop: `-${(15 - lines / 2) * 10}px`,
				}}
			>
				<div id="plinko" />
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
								background: color[index + 8 - lines / 2] || color[lines / 2 - index + 8],
								fontSize: `${15 - lines / 4}px`,
								boxShadow: `0px 3px 0px ${
									color[index + 8 - lines / 2] || color[lines / 2 - index + 8]
								}99`,
							}}
							key={String(mul) + String(index)}
							className={activeBlock === index ? "highlighted" : ""}
						>
							{mul}x
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default GameBoard;
