import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import FormikControl from "../FormField/FormikControl";
import {
	Button,
	Center,
	useToast,
} from "@chakra-ui/react";
import { register } from "../../api/user";

const SignupForm = () => {
	/* -------------------------------- STATES, PROPS, CONTEXTS, HOOKS, VALIDATIONS -------------------------------- */

	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();
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
		try {
			setLoading(true);
			const { data, status } = await register(values.name, values.email, values.newPassword)
			if (status !== 200) {
				toast({
					title: "Error occured",
					description: data,
					status: "error",
					duration: 5000,
					isClosable: true,
					position: "bottom",
				});
				setLoading(false);
			}
			toast({
				title: "Registration successfull",
				status: "success",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});

			localStorage.setItem("userInfo", JSON.stringify(data));

			navigate("/chats");
		} catch (error) {
			toast({
				title: "Error occured",
				description: error.response.data.message,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			setLoading(false);
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
								control="inputField"
								type="text"
								name="name"
								label="First Name"
								holder="Enter your name"
								val={formik.values.name}
							/>
							<FormikControl
								control="inputField"
								type="email"
								name="newEmail"
								label="Email"
								holder="Enter your email"
								val={formik.values.newEmail}
							/>

							<FormikControl
								control="passwordField"
								name="newPassword"
								label="Password"
								holder="Create a new password"
								val={formik.values.newPassword}
							/>

							<FormikControl
								control="passwordField"
								name="confirmPassword"
								label="Confirm Password"
								val={formik.values.confirmPassword}
							/>
							<Center>
								<Button
									type="submit"
									colorScheme="blue"
									variant="solid"
									isLoading={loading}
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
