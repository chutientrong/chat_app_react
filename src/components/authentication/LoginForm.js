import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useHistory } from "react-router-dom";
import FormikControl from "../loginRegister/FormikControl";
import { Button, Center, useToast } from "@chakra-ui/react";
import axios from "axios";

const LoginForm = () => {
  /* -------------------------------- STATES, PROPS, CONTEXTS, HOOKS, VALIDATIONS -------------------------------- */

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const toast = useToast();

  const savedData = {
    email: "test@example.com",
    password: "test@123",
  };

  const iniitialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email format!").required("Required"),
		password: Yup.string()
			.min(6, "Password must more than 6 characters!")
			.required("Required"),
  });

/* -------------------------------- FUNCTIONS -------------------------------- */
// Function handle login user
  const onSubmit = async (values) => {
    try {
      setLoading(true);
      // config header send token
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      // fetc api login user
      const { data } = await axios.post(
        "/api/user/login",
        { email: values.email, password: values.password },
        config
      );
      toast({
        title: "Login successfull",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      history.go("/chats");
    } catch (error) {
      toast({
        title: "Error occured",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

/* -------------------------------- UI -------------------------------- */
  return (
    <>
      <Formik
        initialValues={formData || iniitialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize>
        {(formik) => {
          return (
            <Form>
              <FormikControl
                control="chakrainput"
                type="email"
                name="email"
                label="Email"
                holder="Enter your email"
                val={formik.values.email}
              />

              <FormikControl
                control="chakrapasswordinp"
                name="password"
                label="Password"
                holder="Enter a password"
                val={formik.values.password}
              />

              <Center>
                <Button type="submit" colorScheme="blue" variant="solid" my={1}>
                  Sign In
                </Button>
              </Center>
              <Center>
                <Button
                  type="button"
                  isLoading={loading}
                  colorScheme="red"
                  variant="solid"
                  my={1}
                  onClick={() => setFormData(savedData)}>
                  Sign In With GOOGLE
                </Button>
              </Center>
            </Form>
          );
        }}
      </Formik>
    </>
  );
};

export default LoginForm;

// window.location.reload();
