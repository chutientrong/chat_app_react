import { useState } from "react";
import { Box } from "@chakra-ui/layout";
import { ChatState } from "../context/ChatProvider";
import ChatBox from "../components/Chatting/ChatBox";
import MyChats from "../components/Chatting/MyChats";
import SideDrawer from "../components/Chatting/SideDrawer";

const Chat = () => {
	/* -------------------------------- STATES, PROPS, CONTEXTS, HOOKS -------------------------------- */

	const [fetchAgain, setFetchAgain] = useState(false);
	const { user } = ChatState();

	/* -------------------------------- UI -------------------------------- */
	return (
		<div style={{ width: "100%", backgroundColor: "#15202B" }}>
			{user && <SideDrawer />}
			<Box display="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
				{user && <MyChats fetchAgain={fetchAgain} />}
				{user && (
					<ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
				)}
			</Box>
		</div>
	);
};

export default Chat;
