import { useState } from "react";

export default function useVisualMode(initial)
{
	const [history, setHistory] = useState([initial]);
	const [mode, setMode] = useState(initial);
	const transition = (input, replace) => {

		setMode(input);
		if(!replace)
			setHistory([...history,input]);

	};
	const back = () => {
		if(history.length > 1)
		{
			history.pop();
			console.log(history[history.length-1])
			setMode(history[history.length-1]);
			setHistory(history);
		}
		console.log(history[history.length-1])		
	}
	return { mode, transition, back };
}