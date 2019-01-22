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
		isHide: true,
	}, 
	{
		prop: "gameCoin",
		label: "游戏币数量",
		type: "number",
	}, 
	{
		prop: "deviceId",
		label: "设备ID",
		type: "string",
	}, 
	{
		prop: "activeTime",
		label: "激活时间",
		type: "string",
	}, 
];


const resourceApi = api.resource("paracraftGameCoinKeys", obj => {
}, (obj, oper) => {
	if (oper == "search") {
		obj.active = 1;
	}
}, {columns});

export default {
	api: resourceApi,
	columns,
}
