
import _ from "lodash";

import api from "../api.js";
import consts from "./consts.js";

const columns = [
	{
		prop: "id",
		label: "ID",
		type: "number",
	}, 
	{
		prop: "word",
		label: "铭感词",
		type: "string",
	}, 
];

const sensitiveWordApi = api.resource("sensitiveWords", sensitiveWord => {
}, (sensitiveWord, oper) => {
}, {columns});

export default {
	api: sensitiveWordApi,
	columns,
}
