
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
		query:"userId",
	}, 
	{
		prop: "roleId",
		label: "角色ID",
		type: "number",
		editable: true,
	}, 
	{
		prop: "roleId",
		aliasprop: "rolename",
		label: "角色名",
		type: "select",
		options: [
		{label: "普通用户", value:0},
		{label: "学生", value:1},
		{label: "讲师", value:2},
		{label: "联盟会员", value:8},
		{label: "导师", value:16},
		]
	}, 
	{
		prop: "startTime",
		label: "开始时间",
		type: "number",
		editable: true,
	},
	{
		prop: "endTime",
		label: "结束时间",
		type: "number",
		editable: true,
	},
];

const roleApi = api.resource("roles", role => {
}, (role, oper) => {
}, {columns});

export default {
	api: roleApi,
	columns,
}
