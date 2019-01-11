
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
		prop: "userId",
		label: "用户ID",
		type: "number",
	}, 
	{
		prop: "rmb",
		label: "人民币",
		type: "number",
	}, 
	{
		prop: "coin",
		label: "知识币",
		type: "number",
	}, 
	{
		prop: "bean",
		label: "知识豆",
		type: "number",
	}, 
	{
		prop: "lockCoin",
		label: "待解锁的知识币",
		type: "number",
	}, 
];

const accountApi = api.resource("accounts", account => {
}, (account, oper) => {
}, {columns});

export default {
	api: accountApi,
	columns,
}
