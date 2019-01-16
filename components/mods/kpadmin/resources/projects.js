
import _ from "lodash";

import api from "../api.js";
import consts from "./consts.js";

const columns = [
	{
		prop: "id",
		label: "ID",
		type: "number",
		query: "id",
		sort: true,
	}, 
	{
		prop: "userId",
		label: "用户ID",
		type: "number",
	}, 
	{
		prop: "username",
		relateProp: "userId",
		resource: {
			name: "users",
			srckey: "userId",        // 源字段
			dstkey: "id",            // 目标字段  
			dstval: "username",      // 目标值
		},
		label: "用户名",
		type: "select",
		options: [],
		query:"userId",
	}, 
	{
		prop:"type",
		label: "项目类型",
		type:"select",
		query: "type",
		options: consts.projectType,
	},
	{
		prop:"hotNo",
		label: "热门",
		type:"number",
		editable: true,
	},
	{
		prop:"choicenessNo",
		label: "精选",
		type:"number",
		editable: true,
	},
	{
		prop:"rate",
		label: "评分",
		type:"number",
		editable: true,
	},
	{
		prop: "description",
		label: "备注",
		type: "text",
		editable: true,
	}, 
];

const projectApi = api.resource("projects", project => {
	project.extra = project.extra || {};
}, project => {
}, {columns});

export default {
	api: projectApi,
	columns,
}
