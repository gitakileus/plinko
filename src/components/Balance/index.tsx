import { useEffect, useState } from 'react'
import CountUp from 'react-countup'
import balanceDropdown from 'config/balanceDropdown'
import { ReactComponent as DropdownIcon } from 'assets/icons/dropdown.svg'
import './balance.scss'
import { useGameStore } from 'store/game'

const Balance = () => {
	const balance = useGameStore((state) => state.balance)
	const currency = useGameStore((state) => state.currency)
	const setCurrency = useGameStore((state) => state.setCurrency)
	const [prevBalance, setPrevBalance] = useState(balance[currency])
	const [startbalance, setStartBalance] = useState(balance[currency])
	const [endBalance, setEndBalance] = useState(balance[currency])

	const [activeCurrency, setActiveCurrency] = useState(0)
	const [open, setOpen] = useState(false)

	const handleSelectCurrency = (index: number) => {
		setCurrency(balanceDropdown[index].unit)
		setActiveCurrency(index)
		setOpen(false)
	}

	useEffect(() => {
		let currentBalance = balance[currency]
		setStartBalance(prevBalance)
		setEndBalance(currentBalance)
		setPrevBalance(currentBalance)
	}, [balance[currency]]) //eslint-disable-line

	return (
		<div className={`my-current-balance ${open ? 'open' : ''}`}>
			<div className="content" onClick={() => setOpen((prev) => !prev)}>
				<span>
					${' '}
					<CountUp
						start={startbalance}
						end={endBalance}
						duration={0.5}
						decimals={2}
						decimal="."
					/>
				</span>
				<div className="currency">
					<img
						src={balanceDropdown[activeCurrency].imgUrl}
						alt=""
						className={`currency-icon ${balanceDropdown[activeCurrency].className}`}
					/>
				</div>
				<DropdownIcon className="dropdown-icon" />
			</div>
			<div className="dropdown">
				{balanceDropdown.map((item, index) => (
					<div
						className="dropdown-item"
						key={item.unit}
						onClick={() => handleSelectCurrency(index)}
					>
						<span>US$ {balance[item.unit].toFixed(2)}</span>
						<div className="currency">
							<img
								src={item.imgUrl}
								alt=""
								className={`currency-icon ${item.className}`}
							/>
						</div>
						{item.unit}
					</div>
				))}
			</div>
			<div className="fill-blank" onClick={() => setOpen(false)} />
		</div>
	)
}

export default Balance
