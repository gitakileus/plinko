import { useEffect } from 'react'
import Modal from 'react-modal'
import { ReactComponent as CloseIcon } from 'assets/icons/close-icon.svg'
import { ReactComponent as PointerHandIcon } from 'assets/icons/pointer-hand.svg'
import styles from './contact.module.scss'

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

type ContactModalProps = {
	open: boolean
	onClose: () => void
}

const ContactModal = (props: ContactModalProps) => {
	const { open, onClose } = props

	useEffect(() => {
		const element = document.getElementsByTagName('body')[0]
		if (!open) {
			element.style.overflow = 'auto'
			return
		}
		element.style.overflow = 'hidden'
	}, [open])

	return (
		<Modal
			isOpen={open}
			onRequestClose={onClose}
			ariaHideApp={false}
			styles={customStyles}
			overlayClassName="contact-modal"
		>
			<div className={styles.contact} onClick={onClose}>
				<div className="gradient-wrapper">
					<div className="modal-content">
						<div className="modal-header">
							<h1>Want to use this game in your project?</h1>
							<div>
								<CloseIcon onClick={onClose} />
							</div>
						</div>
						<div className="modal-body">
							<img src="/images/shake-hands.png" alt="" />
							<p>
								Placeholder text about how this modern
								<br />
								<b>Web 3 Casino Solutions</b> Available for Rent
							</p>
						</div>
						<div className="modal-footer">
							<button
								onClick={() =>
									(window.location.href = 'https://forms.gle/r1x2L8uTyEZqqgrb7')
								}
							>
								<PointerHandIcon /> Contact Us
							</button>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	)
}

export default ContactModal
