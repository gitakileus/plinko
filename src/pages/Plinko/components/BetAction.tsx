import { ChangeEvent, useState } from "react";
import { LinesType } from "../@types";
import { maxBallsCount } from "../config";

type PlinkoBetActions = {
	onRunBet: (betValue: number) => void;
	onChangeLines: (lines: LinesType) => void;
	onChangeRisk: (risk: "Low" | "Mid" | "High") => void;
	inGameBallsCount: number;
};

const BetAction = ({
	onRunBet,
	onChangeLines,
	onChangeRisk,
	inGameBallsCount,
}: PlinkoBetActions) => {
	const isLoading = false;
	const currentBalance = 100000;
	const isAuth = true;
	const [betValue, setBetValue] = useState<number>(0);
	const [isAuto, setIsAuto] = useState(false);
	const [autoBallCount, setAutoBallCount] = useState<number>(1);
	// const maxLinesQnt = 16;
	const riskOptions: string[] = ["Low", "Mid", "High"];
	const linesOptions: number[] = [8, 12, 16];
	// for (let i = 8; i <= maxLinesQnt; i++) {
	// 	linesOptions.push(i);
	// }

	const handleChangeRisk = (e: ChangeEvent<HTMLSelectElement>) => {
		if (!isAuth || isLoading) return;
		e.preventDefault();
		onChangeRisk(e.target.value as any);
	};

	const handleChangeBetValue = (e: ChangeEvent<HTMLInputElement>) => {
		if (!isAuth || isLoading) return;
		e.preventDefault();
		setBetValue(e.target.value as any);
	};

	const handleChangeLines = (e: ChangeEvent<HTMLSelectElement>) => {
		if (!isAuth || isLoading) return;

		onChangeLines(Number(e.target.value) as LinesType);
	};

	const handleHalfBet = () => {
		if (!isAuth || isLoading) return;
		const value = betValue / 2;
		const newBetvalue = isNaN(value) || value < 0 ? 0 : Number(value.toFixed(4));
		setBetValue(newBetvalue);
	};

	const handleDoubleBet = () => {
		if (!isAuth || isLoading) return;
		const value = betValue * 2;
		const newBetvalue =
			isNaN(value) || value > currentBalance ? 0 : Number(value.toFixed(4));
		setBetValue(newBetvalue);
	};

	const handleMaxBet = () => {
		if (!isAuth || isLoading) return;
		setBetValue(currentBalance);
	};

	const handleAutoBallCountChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value);
		setAutoBallCount(Number(value));
	};

	const handleRunBet = async () => {
		if (!isAuth || isLoading) return;
		if (betValue <= 0 || betValue === ("" as any)) return;
		if (inGameBallsCount >= maxBallsCount) return;

		const count = !isAuto ? 1 : isNaN(autoBallCount) ? 1 : autoBallCount;
		setAutoBallCount(count);

		for (let i = 0; i < count; i++) {
			if (betValue > currentBalance) {
				setBetValue(currentBalance);
			}
			onRunBet(betValue);
		}
	};

	return (
		<div className="bet-action">
			<div className="game-type">
				<button className={!isAuto ? "active" : ""} onClick={() => setIsAuto(false)}>
					Manual
				</button>
				<button className={isAuto ? "active" : ""} onClick={() => setIsAuto(true)}>
					Auto
				</button>
			</div>
			<div className="bet-amount">
				<span>Bet amount</span>
				<div className="input-box highlight-hover">
					<span>$</span>
					<input type="text" onChange={handleChangeBetValue} value={betValue} />
					<div>
						<button onClick={handleHalfBet}>x1/2</button>
						<button onClick={handleDoubleBet}>x2</button>
						<button onClick={handleMaxBet}>Max</button>
					</div>
				</div>
			</div>
			<div className="risk">
				<span>Risk</span>
				<div className="highlight-hover">
					<select
						disabled={inGameBallsCount > 0}
						onChange={handleChangeRisk}
						defaultValue="Low"
					>
						{riskOptions.map((risk) => (
							<option key={risk} value={risk} style={{ color: "black" }}>
								{risk}
							</option>
						))}
					</select>
				</div>
			</div>
			<div className="rows">
				<span>Rows</span>
				<div className="highlight-hover">
					<select
						disabled={inGameBallsCount > 0}
						onChange={handleChangeLines}
						defaultValue={8}
					>
						{linesOptions.map((line, index) => (
							<option key={line} value={line} style={{ color: "black" }}>
								{line} Rows
							</option>
						))}
					</select>
				</div>
			</div>
			{isAuto ? (
				<div className="number-of-bets">
					<span>Number of bets</span>
					<div className="highlight-hover">
						<input
							type="number"
							value={autoBallCount}
							onChange={handleAutoBallCountChange}
						/>
					</div>
				</div>
			) : (
				<></>
			)}
			<button className="send-ball" onClick={handleRunBet}>
				Send ball
			</button>
		</div>
	);
};

export default BetAction;
