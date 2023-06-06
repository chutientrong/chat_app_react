import React, { useEffect } from "react";
import {
	Container,
	Box,
	Text,
	Tabs,
	Tab,
	TabList,
	TabPanel,
	TabPanels,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/Auth/LoginForm";
import SignupForm from "../components/Auth/SignupForm";

const Home = () => {
	/* -------------------------------- STATES, PROPS, CONTEXTS, HOOKS -------------------------------- */
	const navigate = useNavigate();

	/* -------------------------------- USEEFFECTS -------------------------------- */
	useEffect(() => {
		const user = JSON.parse(localStorage.getItem("userInfo"));
		if (user) {
			navigate("/chats");
		}
	}, [navigate]);

	/* -------------------------------- UI -------------------------------- */
	return (
		<>
			<div className="boxContainer">
				<Container maxW="xl" centerContent>
					<Box
						display="flex"
						justifyContent="center"
						p={3}
						bg="#f1f5f9"
						w="100%"
						m="40px 0 15px 0"
						borderRadius="lg"
						borderWidth="1px"
					>
						<Text fontFamily="Poppins" fontSize="3xl">
							CHATTING APPS
						</Text>
					</Box>
					<Box
						bg="#f1f5f9"
						w="100%"
						p={4}
						mb={3}
						borderRadius="lg"
						borderWidth="1px"
					>
						<Tabs variant="soft-rounded">
							<TabList mb="1em">
								<Tab width="50%">Login</Tab>
								<Tab width="50%">Signup</Tab>
							</TabList>
							<TabPanels>
								<TabPanel>
									<LoginForm />
								</TabPanel>
								<TabPanel>
									<SignupForm />
								</TabPanel>
							</TabPanels>
						</Tabs>
					</Box>
				</Container>
			</div>
		</>
	);
};

export default Home;
