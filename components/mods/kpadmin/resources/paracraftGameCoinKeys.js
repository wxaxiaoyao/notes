
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
		prop: "key",
		label: "激活码",
		type: "string",
		query:"key",
	}, 
	{
		prop: "price",
		label: "价格",
		type: "number",
		editable: true,
	}, 
	{
		prop: "active",
		label: "是否激活",
		type: "number",
		editable: true,
		options: [
		{label:"已激活", value:1},
		{label:"未激活", value:0},
		]
	}, 
	{
		prop: "gameCoin",
		label: "游戏币数量",
		type: "number",
		editable: true,
	}, 
	{
		prop: "deviceId",
		label: "设备ID",
		type: "string",
		editable: true,
	}, 
	{
		prop: "activeTime",
		label: "激活时间",
		type: "string",
	}, 
	{
		prop: "purchase",
		label: "是否购买",
		type: "number",
		editable: true,
		options: [
		{label:"已购买", value:1},
		{label:"未购买", value:0},
		]
	},
	{
		prop: "purchaseName",
		label: "购买者姓名",
		type: "string",
		editable: true,
	}, 
	{
		prop: "purchaseCellphone",
		label: "购买者手机",
		type: "string",
		editable: true,
	}, 
	{
		prop: "purchaseTime",
		label: "购买时间",
		type: "string",
		editable: true,
	}, 
];


const paracraftGameCoinKeyApi = api.resource("paracraftGameCoinKeys", paracraftGameCoinKey => {
}, (paracraftGameCoinKey, oper) => {
}, {columns});

export default {
	api: paracraftGameCoinKeyApi,
	columns,
}
