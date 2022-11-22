import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "./header.scss";

const Header = () => {
	return (
		<header>
			<WalletMultiButton />
		</header>
	);
};

export default Header;
