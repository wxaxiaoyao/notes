
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
		query:"userId",
	}, 
	{
		prop: "type",
		label: "交易类型",
		type: "number",
	}, 
	{
		prop: "subject",
		label: "物品标题",
		type: "string",
	}, 
	{
		prop: "body",
		label: "物品描述",
		type: "string",
	}, 
	{
		prop: "count",
		label: "交易数量",
		type: "number",
	}, 
	{
		prop: "discountId",
		label: "优惠券ID",
		type: "number",
	}, 
	{
		prop: "rmb",
		label: "人民币总价",
		type: "number",
	}, 
	{
		prop: "coin",
		label: "知识币总价",
		type: "number",
	}, 
	{
		prop: "bean",
		label: "知识豆总价",
		type: "number",
	}, 
	{
		prop: "realRmb",
		label: "人民币实价",
		type: "number",
	}, 
	{
		prop: "realCoin",
		label: "知识币实价",
		type: "number",
	}, 
	{
		prop: "realBean",
		label: "知识豆实价",
		type: "number",
	}, 
	{
		prop: "rewardRmb",
		label: "人民币返还",
		type: "number",
	}, 
	{
		prop: "rewardCoin",
		label: "知识币返还",
		type: "number",
	}, 
	{
		prop: "rewardBean",
		label: "知识豆返还",
		type: "number",
	}, 
	{
		prop: "description",
		label: "备注",	
		type: "text",
	},
];

const tradeApi = api.resource("trades", trade => {
}, (trade, oper) => {
}, {columns});

export default {
	api: tradeApi,
	columns,
}
