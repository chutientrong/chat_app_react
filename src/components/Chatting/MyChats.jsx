import React, { useEffect, useState } from "react";
import { useToast } from "@chakra-ui/react";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { AddIcon } from "@chakra-ui/icons";
import { getSender } from "../../config/ChatLogic";
import { Button } from "@chakra-ui/button";
import ChatLoading from "./ChatLoading";
import { ChatState } from "../../context/ChatProvider";
import GroupChatModal from "../Modal/GroupChatModal";
import { getAllChats } from "../../api/chat";

const MyChats = ({ fetchAgain }) => {
	/* -------------------------------- STATES, PROPS, CONTEXTS, HOOKS -------------------------------- */

	const [loggedUser, setLoggedUser] = useState();

	const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
	const toast = useToast();

	/* -------------------------------- FUNCTIONS -------------------------------- */

	// Function get chat
	const fetchChats = async () => {
		try {
			// fetch api get all chat
			const { data } = await getAllChats(user.token);

			setChats(data);
		} catch (error) {
			toast({
				title: "Error Occured!",
				description: "Failed to Load the chats",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom-left",
			});
		}
	};

	/* -------------------------------- USEEFFECTS -------------------------------- */

	useEffect(() => {
		setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
		fetchChats();
	}, [fetchAgain]);

	/* -------------------------------- UI -------------------------------- */

	return (
		<Box
			display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
			flexDir="column"
			alignItems="center"
			p={3}
			bg="#15202B"
			color="white"
			w={{ base: "100%", md: "31%" }}
			borderRadius="lg"
			borderWidth="1px"
		>
			<Box
				pb={3}
				px={3}
				fontSize={{ base: "28px", md: "30px" }}
				fontFamily="Poppins"
				display="flex"
				w="100%"
				justifyContent="space-between"
				alignItems="center"
			>
				Chatting
				<GroupChatModal>
					<Button
						display="flex"
						bg="#657786"
						_hover={{
							background: "white",
							color: "teal.500",
						}}
						fontSize={{ base: "17px", md: "10px", lg: "17px" }}
						rightIcon={<AddIcon />}
					>
						Create Group
					</Button>
				</GroupChatModal>
			</Box>
			<Box
				display="flex"
				flexDir="column"
				p={3}
				bg="#657786"
				w="100%"
				h="100%"
				borderRadius="lg"
				overflowY="hidden"
			>
				{chats ? (
					<Stack overflowY="scroll">
						{chats && chats.map((chat) => (
							<Box
								onClick={() => setSelectedChat(chat)}
								cursor="pointer"
								bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
								color={selectedChat === chat ? "white" : "black"}
								px={3}
								py={2}
								borderRadius="lg"
								key={chat._id}
							>
								<Text>
									{!chat.isGroupChat
										? getSender(loggedUser, chat.users)
										: chat.chatName}
								</Text>
								{/* {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender?.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )} */}
							</Box>
						))}
					</Stack>
				) : (
					<ChatLoading />
				)}
			</Box>
		</Box>
	);
};

export default MyChats;
