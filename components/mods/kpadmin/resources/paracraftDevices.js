
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
		prop: "deviceId",
		label: "设备ID",
		type: "string",
		query:"deviceId",
	}, 
	{
		prop: "password",
		label: "设备密码",
		type: "string",
		editable: true,
	}, 
	{
		prop: "username",
		label: "购买者姓名",
		type: "string",
		editable: true,
	}, 
	{
		prop: "cellphone",
		label: "购买者电话",
		type: "string",
		editable: true,
	}, 
	{
		prop: "purchaseTime",
		label: "购买时间",
		type: "string",
		editable: true,
	}, 
	{
		prop: "gameCoin",
		label: "设备游戏币",
		type: "number",
		editable: true,
	}, 
	{
		prop: "description",
		label: "备注",
		type: "string",
		editable: true,
	}, 
	{
		prop: "purchaseTime",
		label: "购买时间",
		type: "string",
	}, 
];

const paracraftDeviceApi = api.resource("paracraftDevices", paracraftDevice => {
}, (paracraftDevice, oper) => {
}, {columns});

export default {
	api: paracraftDeviceApi,
	columns,
}
