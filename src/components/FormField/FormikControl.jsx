import React from "react";
import InputField from "./InputField";
import PasswordField from "./PasswordField";

function FormikControl(props) {
	/* -------------------------------- STATES, PROPS, CONTEXTS, HOOKS -------------------------------- */

	const { control, ...rest } = props;

	/* -------------------------------- UI -------------------------------- */
	switch (control) {
		case "inputField":
			return <InputField {...rest} />;
		case "passwordField":
			return <PasswordField {...rest} />;
		default:
			return null;
	}
}

export default FormikControl;
