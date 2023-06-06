import React, { useState } from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	IconButton,
	Button,
	useToast,
	Box,
	FormControl,
	Input,
	Spinner,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatProvider";
import UserBadgeItem from "../User/UserBadgeItem";
import UserListItem from "../User/UserListItem";
import { addUserToGroup, renameGroup, removeUserInGroup } from "../../api/chat";
import { searchUser } from "../../api/user";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
	/* -------------------------------- STATES, PROPS, CONTEXTS, HOOKS -------------------------------- */

	const [groupChatName, setGroupChatName] = useState("");
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const [renameLoading, setRenameLoading] = useState(false);

	const { isOpen, onOpen, onClose } = useDisclosure();
	const { user, selectedChat, setSelectedChat } = ChatState();
	const toast = useToast();

	/* -------------------------------- FUNCTIONS -------------------------------- */

	// Function handle add user to group
	const handleAddUser = async (user1) => {
		// Check if user is exsist in group
		if (selectedChat.users.find((u) => u._id === user1._id)) {
			toast({
				title: "User Already in group!",
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "bottom",
			});
			return;
		}

		// Check if user admin is exsist in group
		if (selectedChat.groupAdmin._id !== user._id) {
			toast({
				title: "Only admins can add someone!",
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "bottom",
			});
			return;
		}

		try {
			setLoading(true);

			// fetch api add user to group
			const { data } = await addUserToGroup(user.token, selectedChat._id, user1._id);

			setSelectedChat(data);
			setFetchAgain(!fetchAgain);
			setLoading(false);
		} catch (error) {
			toast({
				title: "Error Occured!",
				description: error.response.data.message,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			setLoading(false);
		}
		setGroupChatName("");
	};

	// Function handle rename group chat
	const handleRename = async () => {
		if (!groupChatName) return;

		try {
			setRenameLoading(true);

			// fetch api rename group
			const { data } = await renameGroup(user.token, selectedChat._id, groupChatName);
			setSelectedChat(data);
			setFetchAgain(!fetchAgain);
			setRenameLoading(false);
		} catch (error) {
			toast({
				title: "Error Occured!",
				description: error.response.data.message,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			setRenameLoading(false);
		}
		setGroupChatName("");
	};

	// Function handle search user
	const handleSearch = async (query) => {
		setSearch(query);
		if (!query) {
			return;
		}

		try {
			setLoading(true);

			// fetch api search user
			const { data } = await searchUser(user.token, search);

			setLoading(false);
			setSearchResult(data);
		} catch (error) {
			toast({
				title: "Error Occured!",
				description: "Failed to Load the Search Results",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom-left",
			});
			setLoading(false);
		}
	};

	//Function handle remove user in group
	const handleRemove = async (user1) => {
		// check is admin can remove
		if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
			toast({
				title: "Only admins can remove someone!",
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "bottom",
			});
			return;
		}

		try {
			setLoading(true);

			// fetch api remove user
			const { data } = await removeUserInGroup(user.token, selectedChat._id, user1._id);

			user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
			setFetchAgain(!fetchAgain);

			// if remove done, reload message
			fetchMessages();
			setLoading(false);
		} catch (error) {
			toast({
				title: "Error Occured!",
				description: error.response.data.message,
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
			setLoading(false);
		}
		setGroupChatName("");
	};
	/* -------------------------------- UI -------------------------------- */
	return (
		<>
			<IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
			<Modal isOpen={isOpen} onClose={onClose} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						fontSize="25px"
						fontFamily="Poppins"
						display="flex"
						justifyContent="center"
					>
						{selectedChat.chatName}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Box w="100%" display="flex" flexWrap="wrap" pb={3}>
							{selectedChat.users.map((u, i) => (
								<UserBadgeItem
									key={i}
									user={u}
									handleFunction={() => handleRemove(u)}
								/>
							))}
						</Box>
						<FormControl display="flex">
							<Input
								placeholder="Chat Name"
								mb={3}
								value={groupChatName}
								onChange={(e) => setGroupChatName(e.target.value)}
							/>
							<Button
								variant="solid"
								colorScheme="teal"
								ml={1}
								isLoading={renameLoading}
								onClick={handleRename}
							>
								Update
							</Button>
						</FormControl>
						<FormControl>
							<Input
								placeholder="Add User to group"
								mb={1}
								onChange={(e) => handleSearch(e.target.value)}
							/>
						</FormControl>
						{loading ? (
							<Spinner size="lg" />
						) : (
							searchResult?.map((user, i) => (
								<UserListItem
									key={i}
									user={user}
									handleFunction={() => handleAddUser(user)}
								/>
							))
						)}
					</ModalBody>
					<ModalFooter>
						<Button onClick={() => handleRemove(user)} colorScheme="red">
							Leave Group
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default UpdateGroupChatModal;
