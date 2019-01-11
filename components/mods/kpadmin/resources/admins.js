
import _ from "lodash";
import md5 from "blueimp-md5";

import api from "../api.js";

const columns = [
	{
		prop: "id",
		label: "ID",
		type: "number",
		query: "id-eq",
		sort: true,
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
		query: "nickname-eq",
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
		prop: "email",
		label: "邮箱",
		type: "string",
		query: "email-eq",
		editable: true,
	}, 
	{
		prop: "description",
		label: "备注",
		type: "string",
		editable: true,
	}, 
];

const adminApi = api.resource("admins", admin => {
	admin.extra = admin.extra || {};
	admin.password = "";
}, admin => {
	if (admin.password) admin.password = md5(admin.password);
	else delete admin.password;
}, {columns});

export default {
	api: adminApi,
	columns,
}
