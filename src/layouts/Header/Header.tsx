import { useGameStore } from "store/game";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "./header.scss";

const Header = () => {
	const balance = useGameStore((state) => state.balance);
	return (
		<header>
			<div className="my-fund">Balance: ${balance.toFixed(2)}</div>
			<WalletMultiButton />
		</header>
	);
};

export default Header;
