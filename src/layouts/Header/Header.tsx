import { useGameStore } from 'store/game'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Balance from 'components/Balance'
import './header.scss'

const Header = () => {
	const balance = useGameStore((state) => state.balance)
	return (
		<header>
			<img src="/images/logo.png" alt="" className='logo' />
			<nav>
				<Balance balance={balance} />
				<WalletMultiButton />
			</nav>
		</header>
	)
}

export default Header
