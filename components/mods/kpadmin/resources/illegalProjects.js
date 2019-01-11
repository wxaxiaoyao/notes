
import _ from "lodash";
import api from "../api.js";
import consts from "./consts.js";

const columns = [
	{
		prop: "id",
		label: "ID",
		type: "number",
		sort: true,
	}, 
	{
		prop: "objectId",
		label: "项目ID",
		type: "number",
		query: "objectId",
		editable: true,
	}, 
	{
		prop: "handler",
		label: "处理人ID",
		type: "number",
	}, 
	{
		prop: "description",
		label: "备注",
		type: "string",
		editable: true,
	}, 
];

const illegalProjectApi = api.resource("illegals", illegalProject => {
	// 传入
	illegalProject.extra = illegalProject.extra || {};
}, (illegalProject, oper) => {
	// 传出
	if (oper == "create" || oper == "update") illegalProject.handler = g_app.store.state.user.id;

	illegalProject.objectType = 5;
}, {columns});

export default {
	api: illegalProjectApi,
	columns,
}
