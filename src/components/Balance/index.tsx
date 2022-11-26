import { useState } from 'react'
import balanceDropdown from 'config/balanceDropdown'
import { ReactComponent as DropdownIcon } from 'assets/icons/dropdown.svg'
import './balance.scss'

type Props = {
	balance: number
}

const Balance = (props: Props) => {
	const [activeCurrency, setActiveCurrency] = useState(0)
	const [open, setOpen] = useState(false)

	const handleSelectCurrency = (index: number) => {
		setActiveCurrency(index)
		setOpen(false)
	}

	return (
		<div className={`my-current-balance ${open ? 'open' : ''}`}>
			<div className="content" onClick={() => setOpen((prev) => !prev)}>
				<span>US$ {props.balance.toFixed(2)}</span>
				<div className="currency">
					<img
						src={balanceDropdown[activeCurrency].imgUrl}
						alt=""
						className={`currency-icon ${balanceDropdown[activeCurrency].className}`}
					/>
				</div>
				<DropdownIcon className="dropdown-icon" />
			</div>
			<div className="dropdown">
				{balanceDropdown.map((item, index) => (
					<div
						className="dropdown-item"
						key={item.unit}
						onClick={() => handleSelectCurrency(index)}
					>
						<span>US$ 0.00</span>
						<div className="currency">
							<img
								src={item.imgUrl}
								alt=""
								className={`currency-icon ${item.className}`}
							/>
						</div>
						{item.unit}
					</div>
				))}
			</div>
			<div className="fill-blank" onClick={() => setOpen(false)} />
		</div>
	)
}

export default Balance
