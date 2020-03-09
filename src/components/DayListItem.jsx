import React from "react";

import "./DayListItem.scss";

const classNames = require('classnames');

export default function DayListItem(props){
	let dayClass = classNames({
		'day-list__item': true,
		'day-list__item--selected': props.selected,
		'day-list__item--full': props.spots === 0
	})

	let formatSpots = (spots) => {
		return spots 
			? (spots > 1) 
				? `${spots} spots remaining` 
				: `${spots} spot remaining` 
			: `no spot remaining` 
	};

	return(
		<li className={dayClass} onClick={() => props.setDay(props.name)}>
			<h2 className="text--regular">{props.name}</h2>
			<h3 className="text--light">{formatSpots(props.spots)}</h3>
		</li>
	)
}