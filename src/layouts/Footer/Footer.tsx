import { useState } from 'react'
import ContactModal from 'components/ContactModal'
import './footer.scss'

const Footer = () => {
	const [open, setOpen] = useState<boolean>(false)
	return (
		<footer>
			<p className="contact-us">
				Want to use this game in your project?&nbsp;
				<span onClick={() => setOpen(true)}>Contact Us</span>
			</p>
			<ContactModal open={open} onClose={() => setOpen(false)} />
		</footer>
	)
}

export default Footer
