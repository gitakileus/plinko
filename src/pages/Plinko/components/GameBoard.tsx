import { LinesType } from "../@types";
import { multiplier, color } from "../config";

type Props = {
	lines: LinesType;
	risk: "Low" | "Mid" | "High";
	pinSize: number;
};

const GameBoard = ({ lines, risk = "Low", pinSize }: Props) => {
	return (
		<div>
			<div id="plinko" />
			<div
				className="multiplier-box"
				style={{
					paddingLeft: `${pinSize * 2}px`,
					paddingRight: `${pinSize * 2}px`,
					gap: `${pinSize * 2}px`,
				}}
			>
				{multiplier[risk][lines / 4 - 2].map((mul: number, index: number) => (
					<div
						style={{
							background: color[index + 8 - lines / 2] || color[lines / 2 - index + 8],
							fontSize: `${14 - lines / 4}px`,
						}}
						key={String(mul) + String(index)}
					>
						{mul}
					</div>
				))}
			</div>
		</div>
	);
};

export default GameBoard;
