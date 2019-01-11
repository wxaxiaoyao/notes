
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
		prop: "objectId",
		label: "项目ID",
		type: "number",
	}, 
	{
		prop: "memberId",
		label: "成员ID",
		type: "number",
	}, 
];

const memberApi = api.resource("members", member => {
	member.extra = member.extra || {};
}, (member, oper) => {
	member.objectType = 5;
}, {columns});

export default {
	api: memberApi,
	columns,
}
