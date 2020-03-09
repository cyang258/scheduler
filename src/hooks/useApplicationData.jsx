import { useReducer, useEffect } from "react";
import axios from 'axios';

const SetDay = "setDay";
const SetApplicationData = "setApplicationData";
const SetInterview = "setInterview";

const reducers = {
	setDay(state, action) {return {...state, day: action.value}},
	setApplicationData(state, action){return { ...state,days: action.value.days, appointments: action.value.appointments, interviewers: action.value.interviewers }},
	setInterview(state, action){
		const appointments = action.value.appointments;

		const days = state.days.map((day) => {
			let spots = day.appointments.filter(id => appointments[id].interview === null || (appointments[id].interview && appointments[id].interview.student === undefined)).length;
			return {...day, spots}		
		});

		return {...state, appointments, days};
	}
}

const reducer = (state, action) => !reducers[action.type] ? new Error(`Tried to reduce with unsupported action type: ${action.type}`) : reducers[action.type](state, action);

export default function useApplicationData(){
	const [state, dispatch] = useReducer(reducer, {
		day: "Monday",
		days: [],
		appointments: [],
		interviewers: []
	});

	const setDay = day => dispatch({ type: SetDay, value: day});

	const bookInterview = (id, interview) =>
	{
		const appointment = {
			...state.appointments[id],
			interview: { ...interview }
		};
		const appointments = {
			...state.appointments,
			[id]: appointment
		};
		return Promise.resolve(axios.put("http://localhost:8001/api/appointments/" + id, { ...appointment }))
			   .then(response=>{
					dispatch({ type: SetInterview, value: {appointments} });
			   });
		
	}

	const cancelInterview = (id) =>
	{
		const appointment = {
		      ...state.appointments[id],
		      interview: null
		    };

		    const appointments = {
		      ...state.appointments,
		      [id]: appointment
		    };
		return Promise.resolve(axios.delete("http://localhost:8001/api/appointments/" + id, { ...appointment }))
			   .then(response=>{
					dispatch({ type: SetInterview , value: {appointments}, id: id });
			   });
		
	}

    useEffect(() => {
    	Promise.all([
    		Promise.resolve(axios.get("http://localhost:8001/api/days")),
    		Promise.resolve(axios.get("http://localhost:8001/api/appointments")),
    		Promise.resolve(axios.get("http://localhost:8001/api/interviewers"))
    	]).then((all) => {
    		const [days, appointments, interviewers] = all;
    		var myInterviewers = Object.keys(interviewers.data).map(key => {
    		    return interviewers.data[key];
    		})
    		dispatch({ type: SetApplicationData, value: { days: days.data, appointments: appointments.data, interviewers: myInterviewers }});
    	});
    }, []);

    return { state, setDay, bookInterview, cancelInterview}
}