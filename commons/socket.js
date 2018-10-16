
export const SOCKET_CMD_ECHO = 0;

export const encodeSocketData = function(cmd, data) {
	return JSON.string({cmd, data});
}

export const decodeSocketData = function(data) {
	return JSON.parse(data);
}


export default {
	encodeSocketData,
	decodeSocketData,

	SOCKET_CMD_ECHO,
}
