import axios from "axios";
import { apiUrl } from ".";

// config header send token
const config = {
	headers: {
		"Content-type": "application/json",
	},
};

export const getAllMessages = async (token, selectedChatId) => {
	try {
		// fetc api get all Messages
		const res = await axios.get(`${apiUrl}/api/message/${selectedChatId}`, {
			headers: {
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

export const createMessage = async (token, newMessage, selectedChatId) => {
	try {
		// fetc api get all Messages
		const res = await axios.post(
			`${apiUrl}/api/message`,
			{
				content: newMessage,
				chatId: selectedChatId,
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
