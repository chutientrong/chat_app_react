// function handle change margin if is the same sender
export const isSameSenderMargin = (messages, m, i, userId) => {
	if (
		i < messages.length - 1 &&
		messages[i + 1].sender?._id === m.sender?._id &&
		messages[i].sender?._id !== userId
	)
		return 33;
	else if (
		(i < messages.length - 1 &&
			messages[i + 1].sender?._id !== m.sender?._id &&
			messages[i].sender?._id !== userId) ||
		(i === messages.length - 1 && messages[i].sender?._id !== userId)
	)
		return 0;
	else return "auto";
};

// function check if is the same sender
export const isSameSender = (messages, m, i, userId) => {
	return (
		i < messages.length - 1 &&
		(messages[i + 1].sender?._id !== m.sender?._id ||
			messages[i + 1].sender?._id === undefined) &&
		messages[i].sender?._id !== userId
	);
};

// function check if is the last message
export const isLastMessage = (messages, i, userId) => {
	return (
		i === messages.length - 1 &&
		messages[messages.length - 1].sender?._id !== userId &&
		messages[messages.length - 1].sender?._id
	);
};

// function check if is the same user
export const isSameUser = (messages, m, i) => {
	return i > 0 && messages[i - 1].sender?._id === m.sender?._id;
};

// function get sender name if user is logged
export const getSender = (loggedUser, users) => {
	return users[0]._id === loggedUser?._id ? users[1]?.name : users[0]?.name;
};

// function get full sender if user is logged
export const getSenderFull = (loggedUser, users) => {
	return users[0]._id === loggedUser._id ? users[1] : users[0];
};
