import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import FormikControl from "../loginRegister/FormikControl";
import {
	Button,
	Center,
	useToast,
} from "@chakra-ui/react";
import axios from "axios";

const SignupForm = () => {
	/* -------------------------------- STATES, PROPS, CONTEXTS, HOOKS, VALIDATIONS -------------------------------- */

	const [picLoading, setPicLoading] = useState(false);

	const history = useHistory();
	const toast = useToast();

	const iniitialValues = {
		name: "",
		newEmail: "",
		newPassword: "",
		confirmPassword: "",
	};

	const validationSchema = Yup.object({
		name: Yup.string().required("Required"),
		newEmail: Yup.string().email("Invalid email format!").required("Required"),
		newPassword: Yup.string()
			.min(6, "Password must more than 6 characters!")
			.required("Required"),
		confirmPassword: Yup.string()
			.oneOf([Yup.ref("newPassword"), null], "Passwords must match!")
			.required("Required"),
	});

	/* -------------------------------- FUNCTIONS -------------------------------- */

	// Function handle register user
	const onSubmit = async (values, onSubmitProps) => {
		setPicLoading(true);
		try {
			// config header send token
			const config = {
				headers: {
					"Content-type": "application/json",
				},
			};

			// fetch api register user
			const { data } = await axios.post(
				"/api/user/register",
				{
					name: values.name,
					email: values.newEmail,
					password: values.newPassword,
				},
				config
			);
			toast({
				title: "Registration successfull",
				status: "success",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});

			localStorage.setItem("userInfo", JSON.stringify(data));

			setPicLoading(false);
			history.go("/chats");
		} catch (error) {
			toast({
				title: "Error occured",
				description: error.response.data.message,
				status: "success",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			setPicLoading(false);
		}
		onSubmitProps.resetForm({});
	};

	/* -------------------------------- UI -------------------------------- */
	return (
		<>
			<Formik
				initialValues={iniitialValues}
				validationSchema={validationSchema}
				onSubmit={onSubmit}
			>
				{(formik) => {
					return (
						<Form>
							<FormikControl
								control="chakrainput"
								type="text"
								name="name"
								label="First Name"
								holder="Enter your name"
								val={formik.values.name}
							/>
							<FormikControl
								control="chakrainput"
								type="email"
								name="newEmail"
								label="Email"
								holder="Enter your email"
								val={formik.values.newEmail}
							/>

							<FormikControl
								control="chakrapasswordinp"
								name="newPassword"
								label="Password"
								holder="Create a new password"
								val={formik.values.newPassword}
							/>

							<FormikControl
								control="chakrapasswordinp"
								name="confirmPassword"
								label="Confirm Password"
								val={formik.values.confirmPassword}
							/>
							<Center>
								<Button
									type="submit"
									colorScheme="blue"
									variant="solid"
									isLoading={picLoading}
									my={1}
								>
									Register
								</Button>
								<Button
									type="reset"
									ms={2}
									colorScheme="blue"
									variant="outline"
								>
									Reset
								</Button>
							</Center>
						</Form>
					);
				}}
			</Formik>
		</>
	);
};

export default SignupForm;
