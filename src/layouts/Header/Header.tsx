import { useState, useEffect, useRef } from 'react'
import { useGameStore } from 'store/game'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Balance from 'components/Balance'
import DepositModal from 'components/DepositModal'
import { ReactComponent as DepositIcon } from 'assets/icons/deposit.svg'
import { ReactComponent as WithdrawIcon } from 'assets/icons/withdraw.svg'
import './header.scss'

const Header = () => {
	const balance = useGameStore((state) => state.balance)
	const currency = useGameStore((state) => state.currency)
	const [prev, setPrev] = useState(balance[currency])
	const [prevCurrency, setPrevCurrency] = useState(currency)
	const ref = useRef<any>(null)
	const [open, setOpen] = useState<boolean>(false)
	const [type, setType] = useState<string>('Deposit')

	useEffect(() => {
		if (currency !== prevCurrency) {
			setPrevCurrency(currency)
		} else if (balance[currency] > prev) {
			const diff = (balance[currency] - prev).toFixed(2)
			const newElement = document.createElement('span')
			newElement.innerText = `$ ${diff}`
			newElement.className = 'diff'
			ref.current!.appendChild(newElement)
		}
		setPrev(balance[currency])
	}, [balance[currency]]) //eslint-disable-line

	const handleDeposit = () => {
		setType('Deposit')
		setOpen(true)
	}

	const handleWithdraw = () => {
		setType('Withdraw')
		setOpen(true)
	}

	return (
		<header>
			<img src="/images/logo.png" alt="" className="logo" />
			<img src="/images/_logo.png" alt="" className="_logo" />
			<nav ref={ref}>
				<Balance />
				<WalletMultiButton />
				<div className="deposit-withdraw">
					<div className="deposit" onClick={handleDeposit}>
						<DepositIcon />
						DEPOSIT
					</div>
					<div className="withdraw" onClick={handleWithdraw}>
						<WithdrawIcon />
						WITHDRAW
					</div>
				</div>
			</nav>
			<DepositModal open={open} onClose={() => setOpen(false)} defaultType={type} />
		</header>
	)
}

export default Header
