import axios from "axios";
import { apiUrl } from ".";

// config header send token
const config = {
	headers: {
		"Content-type": "application/json",
	},
};

export const getAllChats = async (token) => {
	try {
		// fetc api get all chats
		const res = await axios.get(`${apiUrl}/api/chat`, {
			headers: {
				"Content-type": "application/json",
				Authorization: `Bearer ${token}`,
			},
		});

		if (res.status === 200) {
			return res;
		}
	} catch (err) {
		return err.response;
	}
};

export const createGroup = async (token, groupChatName, selectedUsers) => {
	try {
		// fetc api get all Messages
		const res = await axios.post(
			`${apiUrl}/api/chat/group`,
			{
				name: groupChatName,
				users: JSON.stringify(selectedUsers.map((u) => u._id)),
			},
			{
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);

		if (res.status === 200) {
			return res;
		}
	} catch (err) {
		return err.response;
	}
};

export const addUserToGroup = async (token, selectedChatId, userId) => {
	try {
		// fetc api get all Messages
		const res = await axios.post(
			`${apiUrl}/api/chat/group/add`,
			{
				chatId: selectedChatId,
				userId: userId,
			},
			{
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);

		if (res.status === 200) {
			return res;
		}
	} catch (err) {
		return err.response;
	}
};

export const renameGroup = async (token, selectedChatId, groupChatName) => {
	try {
		// fetc api get all Messages
		const res = await axios.post(
			`${apiUrl}/api/chat/group/rename`,
			{
				chatId: selectedChatId,
				chatName: groupChatName,
			},
			{
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);

		if (res.status === 200) {
			return res;
		}
	} catch (err) {
		return err.response;
	}
};

export const removeUserInGroup = async (token, selectedChatId, userId) => {
	try {
		// fetc api get all Messages
		const res = await axios.post(
			`${apiUrl}/api/chat/group/remove`,
			{
				chatId: selectedChatId,
				userId: userId,
			},
			{
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);

		if (res.status === 200) {
			return res;
		}
	} catch (err) {
		return err.response;
	}
};
