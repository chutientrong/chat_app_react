import React from "react";
import { Field } from "formik";
import {
	Input,
	FormControl,
	FormLabel,
	FormErrorMessage,
} from "@chakra-ui/react";

function ChakraInput(props) {
	/* -------------------------------- STATES, PROPS, CONTEXTS, HOOKS -------------------------------- */

	const { label, name, ...rest } = props;

	/* -------------------------------- UI -------------------------------- */
	return (
		<Field name={name}>
			{({ field, form }) => {
				return (
					<FormControl isInvalid={form.errors[name] && form.touched[name]}>
						<FormLabel htmlFor={name}>{label}</FormLabel>
						<Input
							id={name}
							{...rest}
							{...field}
							mb={2}
							value={props.val}
							placeholder={props.holder}
						/>
						<FormErrorMessage fontWeight="400" fontSize="md" mb={2}>
							{form.errors[name]}
						</FormErrorMessage>
					</FormControl>
				);
			}}
		</Field>
	);
}

export default ChakraInput;
