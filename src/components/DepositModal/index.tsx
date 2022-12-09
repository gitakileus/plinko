import { useEffect, useState } from 'react'
import Modal from 'react-modal'
import CurrenyDropdown from './CurrencyDropdown'
import { ReactComponent as CloseIcon } from 'assets/icons/close-icon.svg'
import './deposit.scss'

const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
	},
}

type DepositModalProps = {
	open: boolean
	defaultType: string
	onClose: () => void
}

const DepositModal = ({ open, defaultType, onClose }: DepositModalProps) => {
	const [type, setType] = useState<string>(defaultType)

	useEffect(() => {
		setType(defaultType)
	}, [defaultType])

	return open ? (
		<Modal
			isOpen={open}
			onRequestClose={onClose}
			ariaHideApp={false}
			overlayClassName="deposit-withdraw-modal"
			styles={customStyles}
		>
			<div className="modal-content">
				<div className="close-button" onClick={onClose}>
					<CloseIcon />
				</div>
				<div className="modal-header">
					<div className="type">
						<button
							className={type === 'Deposit' ? 'active' : 'inactive'}
							onClick={() => setType('Deposit')}
						>
							Deposit
						</button>
						<button
							className={type === 'Withdraw' ? 'active' : 'inactive'}
							onClick={() => setType('Withdraw')}
						>
							Withdraw
						</button>
					</div>
				</div>
				<div className="modal-body">
					<div className="flex">
						<CurrenyDropdown />
						<div className="network-type">
							<label htmlFor="networkType">Network</label>
							<div>Solana mainnet</div>
						</div>
					</div>
					<div className="amount">
						<label htmlFor="amount">Amount</label>
						<input type="text" id="amount" defaultValue={0} />
						<p>
							Available Balance: <span>23.0004</span>
						</p>
					</div>
				</div>
				<div className="modal-footer">
					<button className={type === 'Deposit' ? 'deposit-button' : 'withdraw-button'}>
						{type}
					</button>
				</div>
			</div>
		</Modal>
	) : (
		<></>
	)
}

export default DepositModal
