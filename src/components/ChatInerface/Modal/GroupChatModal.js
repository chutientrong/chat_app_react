import React, { useState } from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	useToast,
	Box,
} from "@chakra-ui/react";
import { Input } from "@chakra-ui/input";
import { FormControl } from "@chakra-ui/form-control";
import { Button } from "@chakra-ui/button";
import { ChatState } from "../../../context/ChatProvider";
import axios from "axios";
import UserListItem from "../../userAvatar/UserListItem";
import UserBadgeItem from "../../userAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
	/* -------------------------------- STATES, PROPS, CONTEXTS, HOOKS -------------------------------- */

	const [groupChatName, setGroupChatName] = useState();
	const [selectedUsers, setSelectedUsers] = useState([]);
	const [search, setSearch] = useState("");
	const [searchResult, setSearchResult] = useState([]);
	const [loading, setLoading] = useState(false);

	const { isOpen, onOpen, onClose } = useDisclosure();
	const { user, chats, setChats } = ChatState();
	const toast = useToast();

	/* -------------------------------- FUNCTIONS -------------------------------- */

	// Function search user
	const handleSearch = async (query) => {
		setSearch(query);
		if (!query) {
			return;
		}

		try {
			setLoading(true);

			// config header send token
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			// fetch api search
			const { data } = await axios.get(`/api/user?search=${search}`, config);
			setLoading(false);
			setSearchResult(data);
		} catch (error) {
			toast({
				title: "Error Occured!",
				description: "Failed to Load the search results",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom-left",
			});
		}
	};

	// Funtion create group chat
	const handleSubmit = async () => {
		// check if null
		if (!groupChatName || !selectedUsers) {
			toast({
				title: "Please fill all the fields",
				status: "warning",
				duration: 5000,
				isClosable: true,
				position: "top",
			});
			return;
		}

		try {
			// config header send token
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			// fetch api create group chat
			const { data } = await axios.post(
				"/api/chat/group",
				{
					name: groupChatName,
					users: JSON.stringify(selectedUsers.map((u) => u._id)),
				},
				config
			);

			setChats([data, ...chats]);
			onClose();

			// send alert if success
			toast({
				title: "New group chat created!",
				status: "success",
				duration: 3000,
				isClosable: true,
				position: "bottom",
			});
		} catch (error) {
			toast({
				title: "Error occured while creating group!",
				status: "error",
				duration: 3000,
				isClosable: true,
				position: "bottom",
			});
		}
	};

	// Function handle check group
	const handleGroup = (userToAdd) => {
		if (selectedUsers.includes(userToAdd)) {
			toast({
				title: "User already added!",
				status: "warning",
				duration: 3000,
				isClosable: true,
				position: "top",
			});
			return;
		}
		setSelectedUsers([...selectedUsers, userToAdd]);
	};

	// Function handle delete user
	const handleDelete = (deleteUser) => {
		setSelectedUsers(selectedUsers.filter((sel) => sel._id !== deleteUser._id));
	};

	/* -------------------------------- UI -------------------------------- */

	return (
		<>
			<span onClick={onOpen}>{children}</span>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						fontSize="35px"
						fontFamily="Poppins"
						d="flex"
						justifyContent="center"
					>
						Create Group Chat
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody d="flex" flexDir="column" alignItems="center">
						<FormControl>
							<Input
								placeholder="Group Name"
								mb={3}
								onChange={(e) => setGroupChatName(e.target.value)}
							/>
						</FormControl>
						<FormControl>
							<Input
								placeholder="Add users"
								mb={1}
								onChange={(e) => handleSearch(e.target.value)}
							/>
						</FormControl>
						<Box w="100%" d="flex" flexWrap="wrap">
							{selectedUsers.map((u, i) => (
								<UserBadgeItem
									key={i}
									user={u}
									handleFunction={() => handleDelete(u)}
								/>
							))}
						</Box>
						{loading ? (
							<div>Loading</div>
						) : (
							searchResult
								?.slice(0, 4)
								.map((user, i) => (
									<UserListItem
										key={i}
										user={user}
										handleFunction={() => handleGroup(user)}
									/>
								))
						)}
					</ModalBody>
					<ModalFooter>
						<Button colorScheme="blue" onClick={handleSubmit}>
							Create Group Chat
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default GroupChatModal;
