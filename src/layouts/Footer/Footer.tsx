import { useState } from 'react'
import ContactModal from 'components/ContactModal'
import { ReactComponent as ContactIcon } from 'assets/icons/shake-hand.svg'
import './footer.scss'

const Footer = () => {
	const [open, setOpen] = useState<boolean>(false)
	return (
		<footer>
			<p className="contact-us">
				Want to use this game in your project?&nbsp;
				<a href="https://forms.gle/r1x2L8uTyEZqqgrb7" target="_blank" rel="noreferrer">
					Contact Us
				</a>
			</p>
			<div className="contact-icon" onClick={() => setOpen(true)}>
				<ContactIcon className="contact-money-icon" />
			</div>
			<ContactModal open={open} onClose={() => setOpen(false)} />
		</footer>
	)
}

export default Footer
