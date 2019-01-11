
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
		prop: "no",
		label: "编号",
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
		prop: "state",
		label: "状态",
		type: "select",
		options: [
		{label:"进行中", value:0},
		{label:"已完成", value:1},
		],
	}, 
	{
		prop: "title",
		label: "标题",
		type: "string",
	},
	{
		prop: "content",
		label: "内容",
		type: "text",
	},
	{
		prop: "tags",
		label: "标签",
		type: "string",
	},
	{
		prop: "assigns",
		label: "指派人",
		type: "string",
	},
];

const issueApi = api.resource("issues", issue => {
	issue.extra = issue.extra || {};
}, (issue, oper) => {
	issue.objectType = 5;
}, {columns});

export default {
	api: issueApi,
	columns,
}
