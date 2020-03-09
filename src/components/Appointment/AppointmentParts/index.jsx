import React from "react";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Status from "./Status";
import Form from "./Form";
import Confirm from "./Confirm";
import Error from "./Error";

import useVisualMode from "../../../hooks/useVisualMode";
import "./styles.scss";

export default function Appointment(props){

	const EMPTY = "EMPTY";
	const SHOW = "SHOW";
	const CREATE = "CREATE";
	const Saving = "Saving";
	const Deleting = "Deleting";
	const CONFIRM = "CONFIRM";
	const EDIT = "EDIT";
	const ERROR_SAVE = "ERROR_SAVE";
	const ERROR_DELETE = "ERROR_DELETE";
	const { mode, transition, back } = useVisualMode(
		props.interview ? SHOW : EMPTY
	)

	const Save = (name, interviewer) => {
		const interview = {
			student: name,
			interviewer
		};
		transition(Saving, true);
		props.bookInterview(props.id, interview)
			 .then(response => transition(SHOW))
			 .catch(error=> transition(ERROR_SAVE, true));		
	}

	const Cancel = () => {
		back();
	}

	const Delete = () => {
		transition(Deleting, true);
		props.cancelInterview(props.id)
			 .then(response => transition(EMPTY))
			 .catch(error => transition(ERROR_DELETE, true));
	}

	const confirm = () => {
		transition(CONFIRM);
	}

	const edit = () => {
		transition(EDIT);
	}

	return (
		<article className="appointment">
			<Header time={props.time} />
			{ mode === EMPTY && <Empty onAdd={event => transition(CREATE)} />}
			{ mode === SHOW && (
				<Show 
				  student={props.interview.student} 
				  interviewer={props.interview.interviewer}
				  onDelete={confirm}
				  onEdit={edit}
				/>
			)}
			{ mode === CREATE && (
				<Form 
					interviewers={props.interviewers}
					onSave={Save}
					onCancel={Cancel}
				/>
			)}
			{ (mode === Saving || mode === Deleting) && (
				<Status message={mode} />
			)}
			{ mode === CONFIRM && (
				<Confirm 
					message={mode}
					onConfirm={Delete}
					onCancel={Cancel} 
				/>
			)}
			{ mode === EDIT && (
				<Form 
					name={props.interview.student}
					interviewer={props.interview.interviewer.id}
					interviewers={props.interviewers}
					onSave={Save}
					onCancel={Cancel}
				/>
			)}
			{ (mode === ERROR_DELETE || mode === ERROR_SAVE) && (
				<Error 
					message={`Could not ${mode.substring(mode.indexOf("_")+1)} appointment`}
					onClose={Cancel}
				/>
			)}			
		</article>
	);
}

