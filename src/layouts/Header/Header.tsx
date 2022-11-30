import { useState, useEffect, useRef } from 'react'
import { useGameStore } from 'store/game'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Balance from 'components/Balance'
import './header.scss'

const Header = () => {
	const balance = useGameStore((state) => state.balance)
	const [prev, setPrev] = useState(balance)
	const ref = useRef<any>(null)

	useEffect(() => {
		if (balance > prev) {
			const diff = (balance - prev).toFixed(2)
			const newElement = document.createElement('span')
			newElement.innerText = `$ ${diff}`
			newElement.className = 'diff'
			ref.current!.appendChild(newElement)
		}
		setPrev(balance)
	}, [balance]) //eslint-disable-line

	return (
		<header>
			<img src="/images/logo.png" alt="" className="logo" />
			<nav ref={ref}>
				<Balance balance={balance} />
				<WalletMultiButton />
			</nav>
		</header>
	)
}

export default Header
