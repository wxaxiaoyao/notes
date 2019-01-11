
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
	}, 
	{
		prop: "type",
		label: "类型",
		type: "number",
	}, 
	{
		prop: "rmb",
		label: "人民币",
		type: "number",
	}, 
	{
		prop: "coin",
		label: "知识币",
		type: "number",
	}, 
	{
		prop: "bean",
		label: "知识豆",
		type: "number",
	}, 
	{
		prop: "rewardRmb",
		label: "抵扣人民币",
		type: "number",
	}, 
	{
		prop: "rewardCoin",
		label: "抵扣知识币",
		type: "number",
	}, 
	{
		prop: "rewardBean",
		label: "抵扣知识豆",
		type: "number",
	}, 
	{
		prop: "title",
		label: "标题",
		type: "string",
	},
	{
		prop: "description",
		label: "描述",
		type: "string",
	},
	{
		prop: "startTime",
		label: "开始时间",
		type: "number",
	}, 
	{
		prop: "endTime",
		label: "结束时间",
		type: "number",
	}, 
];

const discountApi = api.resource("discounts", discount => {
}, (discount, oper) => {
}, {columns});

export default {
	api: discountApi,
	columns,
}
