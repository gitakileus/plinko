import { ChangeEvent, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { useGameStore } from 'store/game'
import { LinesType } from '../@types'
import { maxBallsCount } from '../config'
import { ReactComponent as MuteIcon } from 'assets/icons/mute.svg'
import { ReactComponent as UnMuteIcon } from 'assets/icons/unmute.svg'
import Toggle from 'react-toggle'
import 'react-toggle/style.css'

type PlinkoBetActions = {
	onRunBet: (betValue: number) => void
	onChangeLines: (lines: LinesType) => void
	onChangeRisk: (risk: 'Low' | 'Mid' | 'High') => void
	inGameBallsCount: number
	autoBallCount: number
	onChangeAutoBallCount: (ballCount: number) => void
	isAuto: boolean
	onChangeIsAuto: (isAuto: boolean) => void
	leftBallCount: number
	onChangeLeftBallCount: (ballCount: number) => void
	muted: boolean
	onChangeMuted: (muted: boolean) => void
}

let timerId: any = null

const BetAction = ({
	onRunBet,
	onChangeLines,
	onChangeRisk,
	inGameBallsCount,
	autoBallCount,
	onChangeAutoBallCount,
	isAuto,
	onChangeIsAuto,
	leftBallCount,
	onChangeLeftBallCount,
	muted,
	onChangeMuted,
}: PlinkoBetActions) => {
	let balanceState = useGameStore((state) => state.balance)
	const balance = useGameStore((state) => state.balance)
	const currency = useGameStore((state) => state.currency)
	const isLoading = false
	const isAuth = true
	const [betValue, setBetValue] = useState<number>(1)
	const incrementBalance = useGameStore((state) => state.incrementBalance)
	const [curId, setCurId] = useState<number>(0)
	const curIdRef = useRef<any>(null)

	curIdRef.current = curId
	// const maxLinesQnt = 16;
	const riskOptions: string[] = ['Low', 'Mid', 'High']
	const linesOptions: number[] = [8, 12, 16]
	// for (let i = 8; i <= maxLinesQnt; i++) {
	// 	linesOptions.push(i);
	// }

	const handleChangeRisk = (e: ChangeEvent<HTMLSelectElement>) => {
		if (!isAuth || isLoading) return
		e.preventDefault()
		onChangeRisk(e.target.value as any)
	}

	const handleChangeBetValue = (e: ChangeEvent<HTMLInputElement>) => {
		if (!isAuth || isLoading) return
		e.preventDefault()
		setBetValue(e.target.value as any)
	}

	const handleChangeLines = (e: ChangeEvent<HTMLSelectElement>) => {
		if (!isAuth || isLoading) return

		onChangeLines(Number(e.target.value) as LinesType)
	}

	const handleHalfBet = () => {
		if (!isAuth || isLoading) return
		const value = betValue / 2
		const newBetvalue = isNaN(value) || value < 0 ? 0 : Number(value.toFixed(4))
		setBetValue(newBetvalue)
	}

	const handleDoubleBet = () => {
		if (!isAuth || isLoading) return
		const value = betValue * 2
		const newBetvalue =
			isNaN(value) || value > balance[currency] ? 0 : Number(value.toFixed(4))
		setBetValue(newBetvalue)
	}

	const handleMaxBet = () => {
		if (!isAuth || isLoading) return
		setBetValue(Math.floor(+balance[currency] * 100) / 100)
	}

	const handleAutoBallCountChange = (e: ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value)
		onChangeAutoBallCount(Number(value))
	}

	const handleRunBet = async () => {
		if (timerId) return
		if (!isAuth || isLoading) return
		if (betValue <= 0 || betValue === ('' as any)) {
			toast.error(
				<div style={{ color: 'red', fontSize: '18px' }}>Must place a bet above $0!</div>
			)
			return
		}
		if (inGameBallsCount >= maxBallsCount) return

		if (!isAuto) {
			if (betValue > balance[currency]) {
				toast.error(
					<div style={{ color: 'red', fontSize: '18px' }}>Not Enough Fund!</div>
				)
				return
			}
			incrementBalance(-betValue)
			onRunBet(betValue)
			return
		}

		const count = !isAuto ? 1 : isNaN(autoBallCount) ? 1 : autoBallCount
		onChangeAutoBallCount(count)
		onChangeLeftBallCount(count)

		timerId = setInterval(() => {
			if (curIdRef.current === count) {
				setCurId(0)
				clearInterval(timerId)
				timerId = null
			} else {
				if (betValue > balanceState[currency]) {
					toast.error(
						<div style={{ color: 'red', fontSize: '18px' }}>Not Enough Fund!</div>
					)
					setCurId(0)
					clearInterval(timerId)
					timerId = null
					onChangeLeftBallCount(0)
					return
				}
				balanceState[currency] -= betValue
				incrementBalance(-betValue)
				onRunBet(betValue)
				setCurId((prev) => prev + 1)
			}
		}, 300)
	}

	return (
		<div className={`bet-action ${inGameBallsCount > 0 ? 'disabled' : ''}`}>
			<div className="game-type">
				<button
					className={!isAuto ? 'active' : ''}
					onClick={() => onChangeIsAuto(false)}
					disabled={inGameBallsCount > 0}
				>
					Manual
				</button>
				<button
					className={isAuto ? 'active' : ''}
					onClick={() => onChangeIsAuto(true)}
					disabled={inGameBallsCount > 0}
				>
					Auto
				</button>
			</div>
			<div className="bet-amount">
				<span className="title">Bet amount</span>
				<div className="input-box highlight-hover">
					<span>$</span>
					<input
						type="text"
						onChange={handleChangeBetValue}
						value={betValue}
						disabled={inGameBallsCount > 0}
					/>
					<div>
						<button onClick={handleHalfBet} disabled={inGameBallsCount > 0}>
							x1/2
						</button>
						<button onClick={handleDoubleBet} disabled={inGameBallsCount > 0}>
							x2
						</button>
						<button onClick={handleMaxBet} disabled={inGameBallsCount > 0}>
							Max
						</button>
					</div>
				</div>
			</div>
			<div className="risk">
				<span className="title">Risk</span>
				<div className="highlight-hover">
					<select
						onChange={handleChangeRisk}
						defaultValue="Low"
						disabled={inGameBallsCount > 0}
					>
						{riskOptions.map((risk) => (
							<option key={risk} value={risk} style={{ color: 'black' }}>
								{risk}
							</option>
						))}
					</select>
				</div>
			</div>
			<div className="rows">
				<span className="title">Rows</span>
				<div className="highlight-hover">
					<select
						onChange={handleChangeLines}
						defaultValue={8}
						disabled={inGameBallsCount > 0}
					>
						{linesOptions.map((line, index) => (
							<option key={line} value={line} style={{ color: 'black' }}>
								{line}
							</option>
						))}
					</select>
				</div>
			</div>
			{isAuto ? (
				<div className="number-of-bets">
					<span className="title">Number of bets</span>
					<div className="highlight-hover">
						<input
							type="number"
							value={autoBallCount}
							onChange={handleAutoBallCountChange}
							disabled={inGameBallsCount > 0}
						/>
					</div>
				</div>
			) : (
				<></>
			)}
			<button
				className="send-ball"
				onClick={handleRunBet}
				disabled={inGameBallsCount > 0 && isAuto}
				style={{
					cursor: `${inGameBallsCount > 0 && isAuto ? 'not-allowed' : 'pointer'}`,
				}}
			>
				Send ball
			</button>
			<div className="toggle-button">
				<Toggle
					checked={!muted}
					onChange={() => onChangeMuted(!muted)}
					icons={{
						checked: <UnMuteIcon className="mute-icon" />,
						unchecked: <MuteIcon className="mute-icon" />,
					}}
					className="mute-toggle"
				/>
			</div>
		</div>
	)
}

export default BetAction
