import { useEffect, useState } from 'react'
import CountUp from 'react-countup'
import balanceDropdown from 'config/balanceDropdown'
import { ReactComponent as DropdownIcon } from 'assets/icons/dropdown.svg'
import './CurrencyDropdown.scss'
import { useGameStore } from 'store/game'

const CurrencyDropdown = () => {
	const [activeCurrency, setActiveCurrency] = useState(0)
	const [open, setOpen] = useState(false)

	const handleSelectCurrency = (index: number) => {
		setActiveCurrency(index)
		setOpen(false)
	}

	return (
		<div className={`currency-dropdown ${open ? 'open' : ''}`}>
			<span className='currency-title'>Currency</span>
			<div className="content" onClick={() => setOpen((prev) => !prev)}>
				<div className="currency">
					<img
						src={balanceDropdown[activeCurrency].imgUrl}
						alt=""
						className={`currency-icon ${balanceDropdown[activeCurrency].className}`}
					/>
				</div>
				{balanceDropdown[activeCurrency].unit}
				<DropdownIcon className="dropdown-icon" />
			</div>
			<div className="dropdown">
				{balanceDropdown.map((item, index) => (
					<div
						className="dropdown-item"
						key={item.unit}
						onClick={() => handleSelectCurrency(index)}
					>
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
		</div>
	)
}

export default CurrencyDropdown
