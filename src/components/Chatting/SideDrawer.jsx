import React, { useState } from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import {
	Badge,
	Tooltip,
	Menu,
	MenuButton,
	MenuList,
	MenuItem,
	MenuDivider,
	useToast,
	Drawer,
	DrawerBody,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
} from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";
import { Input } from "@chakra-ui/input";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "../Modal/ProfileModal";
import { useNavigate } from "react-router";
import ChatLoading from "./ChatLoading";
import UserListItem from "../User/UserListItem";
import { getSender } from "../../config/ChatLogic";
import { accessUser, searchUser } from "../../api/user";

const SideDrawer = () => {
	/* -------------------------------- STATES, PROPS, CONTEXTS, HOOKS -------------------------------- */

	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const {
		user,
		setSelectedChat,
		chats,
		setChats,
		notification,
		setNotification,
	} = ChatState();
	const toast = useToast();

	/* -------------------------------- FUNCTIONS -------------------------------- */

	// Function handle logout
	const logoutHandler = () => {
		toast({
			title: "Logged out successfully!",
			status: "warning",
			duration: 5000,
			isClosable: true,
			position: "bottom",
		});
		localStorage.removeItem("userInfo");
		navigate("/");
	};

	// Function handle search user
	const handleSearch = async () => {
		if (!search) {
			toast({
				title: "Please enter something in search",
				status: "warning",
				duration: 4000,
				isClosable: true,
				position: "top-left",
			});
			return;
		}

		try {
			setLoading(true);

			// fetch api search
			const { data } = await searchUser(user.token, search)
			setLoading(false);
			setSearchResult(data);
		} catch (error) {
			console.log("eeee", error);
			toast({
				title: "Error occured",
				description: "Failed to load the search results",
				status: "error",
				duration: 4000,
				isClosable: true,
				position: "bottom-left",
			});
		}
	};

	// Function handle access to chatting
	const accessChat = async (userId) => {
		try {
			// fetch api get user 
			const { data } = await accessUser(user.token, userId)

			if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
			console.log("setSelectedChat",data)
			setSelectedChat(data);
			onClose();
			navigate("/chats");
		} catch (error) {
			console.log(error);
		}
	};

	/* -------------------------------- UI -------------------------------- */
	return (
		<>
			<Box
				bg="primary"
				color="white"
				borderColor="#15202B"
				display="flex"
				justifyContent="space-between"
				alignItems="center"
				w="100%"
				p="5px 10px 5px 10px"
				borderWidth="5px"
			>
				<Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
					<Button colorScheme='teal' variant='outline' onClick={onOpen}>
						<i className="fas fa-search"></i>
						<Text display={{ base: "none", md: "flex" }} px={4}>
							Search User
						</Text>
					</Button>
				</Tooltip>
				<Text fontSize="2xl" fontFamily="Poppins">
					CHATTING APP
				</Text>
				<div>
					<Menu>
						<MenuButton p={1}>
							<BellIcon fontSize="2xl" m={1} />
							{notification.length === 0 ? (
								""
							) : (
								<Badge colorScheme="green" fontSize="0.8em">
									{notification.length}
								</Badge>
							)}
						</MenuButton>
						<MenuList pl={2} bg="#657786">
							{!notification.length && "No new messages"}
							{notification.map((noti) => (
								<MenuItem
									key={noti._id}
									_hover={{
										background: "white",
										color: "teal.500",
									}}
									onClick={() => {
										setSelectedChat(noti.chat);
										setNotification(notification.filter((n) => n !== noti));
									}}
								>
									{noti.chat.isGroupChat
										? `New message in ${noti.chat.chatName}`
										: `New message from ${getSender(user, noti.chat.users)}`}
								</MenuItem>
							))}
						</MenuList>
					</Menu>
					<Menu>
						<MenuButton
							as={Button}
							bg="#657786"
							rightIcon={<ChevronDownIcon />}
						>
							<Avatar
								size="sm"
								cursor="pointer"
								name={user.name}
								src={user.pic}
							/>
						</MenuButton>
						<MenuList bg="#657786">
							<ProfileModal user={user}>
								<MenuItem
									color="white"
									bg="#657786"
									_hover={{
										background: "white",
										color: "teal.500",
									}}
								>
									My Profile
								</MenuItem>
							</ProfileModal>
							<MenuDivider />
							<MenuItem
								onClick={logoutHandler}
								color="white"
								bg="#657786"
								_hover={{
									background: "white",
									color: "teal.500",
								}}
							>
								Logout
							</MenuItem>
						</MenuList>
					</Menu>
				</div>
			</Box>

			<Drawer placement="left" onClose={onClose} isOpen={isOpen}>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerHeader bg="#15202B" color="white" borderBottomWidth="1px">
						Search Users
					</DrawerHeader>

					<DrawerBody bg="#15202B" color="white">
						<Box display="flex" pb={2}>
							<Input
								placeholder="Search by name or email"
								mr={2}
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
							<Button
								bg="#AAB8C2"
								onClick={handleSearch}
								_hover={{
									background: "white",
									color: "teal.500",
								}}
							>
								Go
							</Button>
						</Box>
						{loading ? (
							<ChatLoading />
						) : (
							searchResult?.map((user) => {
								return (
									<UserListItem
										key={user._id}
										user={user}
										handleFunction={() => {
											accessChat(user._id);
											
										}}
									/>
								);
							})
						)}
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default SideDrawer;
