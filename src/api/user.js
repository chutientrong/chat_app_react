import axios from "axios";
import { apiUrl } from ".";

// config header send token
const config = {
	headers: {
		"Content-type": "application/json",
	},
};

export const login = async (email, password) => {
	const data = { email, password };
	try {
		// fetc api login user
		const res = await axios.post(`${apiUrl}/api/user/login`, data, config);

		if (res.status === 201) {
			return res;
		}
	} catch (err) {
		return err.response;
	}
};

export const register = async (name, email, password) => {
	const data = { name:name, email:email, password:password };
	try {
		// fetch api register user
		let res = await axios.post(`${apiUrl}/api/user/register`, data, config);
		if (res.status === 200) {
			return res;
		}
	} catch (err) {
		return err.response;
	}
};

export const logout = async () => {
	try {
		let res = await axios.post(`${apiUrl}/api/user/logout`);
		return res;
	} catch (err) {
		return err.response;
	}
};

export const searchUser = async (token, search) => {
	try {
		let res = await axios.get(`${apiUrl}/api/user?search=${search}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return res;
	} catch (err) {
		return err.response;
	}
};
export const accessUser = async (token, userId) => {
	try {
		let res = await axios.post(
			`${apiUrl}/api/user`,
			{ userId },
			{
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return res;
	} catch (err) {
		return err.response;
	}
};
export const getSelf = async (token) => {
	try {
		let res = await axios.post(
			`${apiUrl}/user/self`,
			{},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
		return res;
	} catch (err) {
		return err.response;
	}
};
