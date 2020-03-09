export function getAppointmentsForDay(state, day) 
{
	if(state.days.length === 0) return [];
	if(state.days.filter(d => d.name === day).length === 0) return [];

	return state.days.filter(d => d.name === day)[0].appointments.map(id => state.appointments[id]);
};

export function getInterview(state, interview)
{
	let interviewers = state.interviewers;

	for(let key in interviewers)
	{
		if(interview && interview.interviewer)
			if(interview.interviewer === interviewers[key].id)
				interview.interviewer = interviewers[key];
	}
	return interview;
}

export function getInterviewersForDay(state, day)
{
	if(state.days.length === 0) return [];
	if(state.days.filter(d => d.name === day).length === 0) return [];  

	return state.days.filter(d => d.name === day)[0].interviewers.map(id => state.interviewers.find(item => item.id===id));
}