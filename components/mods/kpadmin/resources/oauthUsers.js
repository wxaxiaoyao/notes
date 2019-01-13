
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
		query: "userId",
	}, 
	{
		prop: "externalId",
		label: "外部账号ID",
		type: "string",
	}, 
	{
		prop: "externalUsername",
		label: "外部账号名",
		type: "string",
	}, 
	{
		prop: "type",
		aliasprop: "aliastype",
		label: "外部平台",
		type: "select",
		options: [
		{label:"QQ", value:0},
		{label:"微信", value:1},
		{label:"GITHUB", value:2},
		{label:"新浪", value:3},
		{label:"QQ游戏", value:4},
		],
	}, 
];

const oauthUserApi = api.resource("oauthUsers", oauthUser => {
}, (oauthUser, oper) => {
}, {columns});

export default {
	api: oauthUserApi,
	columns,
}
