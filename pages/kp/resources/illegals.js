
import _ from "lodash";
import api from "../api.js";
import consts from "./consts.js";

const illegalApi = api.resource("illegals", illegal => {
	illegal.extra = illegal.extra || {};
}, (illegal, oper) => {
	if (oper == "create" || oper == "update") illegal.handler = g_app.store.state.user.id;
});

export default {
	api: illegalApi,

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
	}, 
	{
		prop: "objectType",
		label: "对象类型",
		type: "select",
		query: "objectType",
		options: consts.objectType,
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
