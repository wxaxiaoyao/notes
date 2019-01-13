import _ from "lodash";
import md5 from "blueimp-md5";

import api from "./api.js";

const columns = [
	{
		prop: "id",
		label: "ID",
		type: "number",
		query: "id-eq",
	}, 
	{
		prop: "username",
		label: "用户名",
		type: "string",
		query: "username-eq",
		sort: true,
	}, 
	{
		prop: "password",
		label: "密码",
		type: "string",
		isHide: true,
		editable: true,
	}, 
	{
		prop: "nickname",
		label: "昵称",
		type: "string",
		editable: true,
	}, 
	{
		prop: "cellphone",
		label: "手机号",
		type: "string",
		query: "cellphone-eq",
		editable: true,
	}, 
	{
		prop: "realname",
		label: "实名手机号",
		type: "string",
		editable: true,
	}, 
	{
		prop: "email",
		label: "邮箱",
		type: "string",
		query: "email-eq",
		editable: true,
	}, 
	{
		prop: "description",
		label: "备注",
		type: "text",
		editable: true,
	}, 
];

const userApi = api.resource("users", {
	formatIn: obj => {
		obj.extra = obj.extra || {};
		obj.password = "";
	},
	formatOut: obj => {
		if (obj.password) obj.password = md5(obj.password);
	},
	columns,
});

export default {
	api: userApi,
	columns,
}
