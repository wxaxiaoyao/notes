
import _ from "lodash";
import api from "../api.js";
import consts from "./consts.js";

const illegalUserApi = api.resource("illegals", illegalUser => {
	// 传入
	illegalUser.extra = illegalUser.extra || {};
}, (illegalUser, oper) => {
	// 传出
	if (oper == "create" || oper == "update") illegalUser.handler = g_app.store.state.user.id;

	illegalUser.objectType = 0;
});

export default {
	api: illegalUserApi,

	columns: [
	{
		prop: "id",
		label: "ID",
		type: "number",
		sort: true,
	}, 
	{
		prop: "objectId",
		label: "对象ID",
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
	],
}
