
import _ from "lodash";
import api from "../api.js";
import consts from "./consts.js";

const illegalApi = api.resource("illegals", illegal => {
	illegal.extra = illegal.extra || {};
}, illegal => {
	illegal.handler = g_app.store.state.user.id;
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
		editable: true,
	}, 
	{
		prop: "objectType",
		propLabel: "label",
		propValue: "value",
		label: "对象类型",
		type: "select",
		query: "objectType",
		editable: true,
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
