import _ from "lodash";
import api from "./api.js";

const columns = [
	{
		prop: "id",
		label: "ID",
		type: "number",
		query: "id-eq",
		sort: true,
	}, 
	{
		prop: "type",
		aliasprop: "aliastype",
		label: "应用类型",
		type: "select",
		query: "type",
		options: [
		{label:"安卓APP", value:0},
		{label:"苹果APP", value:1},
		]
	}, 
	{
		prop: "versionNo",
		label: "版本号",
		type: "number",
		editable: true,
	}, 
	{
		prop: "versionName",
		label: "版本名",
		type: "string",
		editable: true,
	}, 
	{
		prop: "downloadUrl",
		label: "下载地址",
		type: "string",
		editable: true,
	}, 
	{
		prop: "description",
		label: "备注",
		type: "text",
		editable: true,
	}, 
];

const versionApi = api.resource("versions", {
	formatIn: obj => {
		obj.extra = obj.extra || {};
	},
	formatOut: obj => {
	},
	columns,
});

export default {
	api: versionApi,
	columns,
	query: {"x-order": "id-desc"},
}
