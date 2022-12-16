import { useEffect, useState } from 'react'
import CountUp from 'react-countup'
import DepositModal from 'components/DepositModal'
import balanceDropdown from 'config/balanceDropdown'
import { ReactComponent as DropdownIcon } from 'assets/icons/dropdown.svg'
import { ReactComponent as DepositIcon } from 'assets/icons/deposit.svg'
import { ReactComponent as WithdrawIcon } from 'assets/icons/withdraw.svg'
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

	const [modalOpen, setModalOpen] = useState<boolean>(false)
	const [type, setType] = useState<string>('Deposit')

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

	const handleDeposit = () => {
		setType('Deposit')
		setModalOpen(true)
	}

	const handleWithdraw = () => {
		setType('Withdraw')
		setModalOpen(true)
	}

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
				<div className="currency" style={{ marginLeft: 'auto' }}>
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
				<div className="deposit-withdraw">
					<div className="deposit" onClick={handleDeposit}>
						<div className="deposit-icon">
							<DepositIcon />
						</div>
						DEPOSIT
					</div>
					<div className="withdraw" onClick={handleWithdraw}>
						<div className="withdraw-icon">
							<WithdrawIcon />
						</div>
						WITHDRAW
					</div>
				</div>
			</div>
			<div className="fill-blank" onClick={() => setOpen(false)} />
			<DepositModal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				defaultType={type}
			/>
		</div>
	)
}

export default Balance
