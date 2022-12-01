import { useState, useEffect, useRef } from 'react'
import { useGameStore } from 'store/game'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Balance from 'components/Balance'
import './header.scss'

const Header = () => {
	const balance = useGameStore((state) => state.balance)
	const currency = useGameStore((state) => state.currency)
	const [prev, setPrev] = useState(balance[currency])
	const [prevCurrency, setPrevCurrency] = useState(currency)
	const ref = useRef<any>(null)

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

	return (
		<header>
			<img src="/images/logo.png" alt="" className="logo" />
			<nav ref={ref}>
				<Balance />
				<WalletMultiButton />
			</nav>
		</header>
	)
}

export default Header
