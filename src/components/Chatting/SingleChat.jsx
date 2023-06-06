import React, { useState, useEffect } from "react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import {
	Box,
	FormControl,
	IconButton,
	Input,
	Spinner,
	Text,
	useToast,
} from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import { getSender, getSenderFull } from "../../config/ChatLogic";
import ProfileModal from "../Modal/ProfileModal";
import UpdateGroupChatModal from "../Modal/UpdateGroupChatModal";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import { createMessage, getAllMessages } from "../../api/message";


const ENDPOINT = "https://chat-app-node.adaptable.app/";
var socket, seletedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
	/* -------------------------------- STATES, PROPS, CONTEXTS, HOOKS -------------------------------- */

	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);
	const [newMessage, setNewMessage] = useState("");
	const [socketConnected, setSocketConnected] = useState(false);
	const [typing, setTyping] = useState(false);
	const [isTyping, setIsTyping] = useState(false);

	const { user, selectedChat, setSelectedChat, notification, setNotification } =
		ChatState();
	const toast = useToast();

	/* -------------------------------- FUNCTIONS -------------------------------- */

	// Fucntion get all messages
	const fetchMessages = async () => {
		if (!selectedChat) return;

		try {
			setLoading(true);
			// fetch api get all messages by chat id
			const { data } = await getAllMessages(user.token, selectedChat._id);

			setMessages(data);
			setLoading(false);
			// emit join chat with chat id
			socket.emit("join chat", selectedChat._id);
		} catch (error) {
			toast({
				title: "Error Occured!",
				description: "Failed to load the messages",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
		}
	};

	// Function handle send message
	const sendMessage = async (event) => {
		if (event.key === "Enter" && newMessage) {
			socket.emit("stop typing", selectedChat._id);
			try {
				setNewMessage("");

				// fetch api send message
				const { data } = await createMessage(user.token, newMessage, selectedChat._id)

				// emit new message to socket
				socket.emit("new message", data);
				setMessages([...messages, data]);
			} catch (error) {
				toast({
					title: "Error Occured!",
					description: "Failed to send the message",
					status: "error",
					duration: 3000,
					isClosable: true,
					position: "bottom",
				});
			}
		}
	};

	// Function handle type input
	const typingHandler = (e) => {
		setNewMessage(e.target.value);

		// typing indicator logic
		if (!socketConnected) return;

		if (!typing) {
			setTyping(true);

			// emeit typing to socket
			socket.emit("typing", selectedChat._id);
		}
		let lastTypingTime = new Date().getTime();
		var timerLength = 3000;
		setTimeout(() => {
			var timeNow = new Date().getTime();
			var timeDiff = timeNow - lastTypingTime;
			if (timeDiff >= timerLength && typing) {
				// emit stop typing to socket
				socket.emit("stop typing", selectedChat._id);
				setTyping(false);
			}
		}, timerLength);
	};

	/* -------------------------------- USEEFFECTS -------------------------------- */

	// setup connect socket
	useEffect(() => {
		socket = io(ENDPOINT);
		socket.emit("setup", user);
		socket.on("connected", () => setSocketConnected(true));
		socket.on("typing", () => setIsTyping(true));
		socket.on("stop typing", () => setIsTyping(false));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// get message if choose a chat
	useEffect(() => {
		fetchMessages();
		seletedChatCompare = selectedChat;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedChat]);

	//
	useEffect(() => {
		socket.on("message received", (newMessageReceived) => {
			if (
				!seletedChatCompare ||
				seletedChatCompare._id !== newMessageReceived.chat._id
			) {
				if (!notification.includes(newMessageReceived)) {
					setNotification([newMessageReceived, ...notification]);
					setFetchAgain(!fetchAgain);
				}
			} else {
				setMessages([...messages, newMessageReceived]);
			}
		});
	});

	/* -------------------------------- UI -------------------------------- */
	return (
		<>
			{selectedChat ? (
				<>
					<Text
						fontSize={{ base: "28px", md: "30px" }}
						pb={3}
						px={2}
						w="100%"
						fontFamily="Poppins"
						display="flex"
						justifyContent={{ base: "space-between" }}
						alignItems="center"
					>
						<IconButton
							display={{ base: "flex", md: "none" }}
							icon={<ArrowBackIcon />}
							onClick={() => setSelectedChat("")}
						/>
						{!selectedChat.isGroupChat ? (
							<>
								{getSender(user, selectedChat.users)}
								<ProfileModal user={getSenderFull(user, selectedChat.users)} />
							</>
						) : (
							<>
								{selectedChat.chatName.toUpperCase()}
								<UpdateGroupChatModal
									fetchAgain={fetchAgain}
									setFetchAgain={setFetchAgain}
									fetchMessages={fetchMessages}
								/>
							</>
						)}
					</Text>
					<Box
						display="flex"
						flexDir="column"
						justifyContent="flex-end"
						p={3}
						bg="#15202B"
						color="white"
						w="100%"
						h="100%"
						borderRadius="lg"
						overflowY="hidden"
					>
						{loading ? (
							<Spinner
								size="xl"
								w={20}
								h={20}
								alignSelf="center"
								margin="auto"
							/>
						) : (
							<div className="messages">
								<ScrollableChat messages={messages} />
							</div>
						)}
						<FormControl onKeyDown={sendMessage} isRequired>
							{isTyping ? (
								<lottie-player
									src="https://assets1.lottiefiles.com/packages/lf20_xxgrirnx.json"
									background="transparent"
									size="50"
									style={{
										marginLeft: 0,
										width: "100px",
										height: "auto",
									}}
									speed="1"
									loop
									autoplay
								></lottie-player>
							) : (
								<></>
							)}
							<Input
								mt={2}
								variant="filled"
								bg="E0E0E0"
								placeholder="Enter a message..."
								onChange={typingHandler}
								value={newMessage}
							/>
						</FormControl>
					</Box>
				</>
			) : (
				<Box display="flex" alignItems="center" justifyContent="center" h="100%">
					<Text fontSize="3xl" pb={3} fontFamily="Poppins">
						Click on a user to start chatting
					</Text>
				</Box>
			)}
		</>
	);
};

export default SingleChat;
