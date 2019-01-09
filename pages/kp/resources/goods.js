import _ from "lodash";
import api from "../api.js";

const goodsApi = api.resource("goods", goods => {
	goods.extra = goods.extra || {};
	goods["extra.enSubject"] = goods.extra.enSubject;
	goods["extra.enBody"] = goods.extra.enBody;
}, goods => {
	goods.extra = goods.extra || {};
	goods.extra.enSubject = goods["extra.enSubject"];
	goods.extra.enBody = goods["export.enBody"];
});

export default {
	api: goodsApi,

	columns: [
	{
		prop: "id",
		label: "ID",
		type: "number",
		query: "id-eq",
		sort: true,
	}, 
	{
		prop: "goodsId",
		label: "物品ID",
		type: "number",
		query: "goodsId-eq",
		sort: true,
	}, 
	{
		prop: "platform",
		label: "物品所属平台",
		type: "string",
		query: "platform-eq",
		sort: true,
	}, 
	{
		prop: "thumbnail",
		label: "物品logo",
		type: "string",
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
		prop: "extra.enSubject",
		label: "英文物品标题",
		editable: true,
		type: "string",
	}, 
	{
		prop: "extra.enBody",
		label: "英文物品描述",
		type: "string",
		editable: true,
	}, 
	{
		prop: "defaultCount",
		label: "默认数量",
		type: "number",
	}, 
	{
		prop: "min",
		label: "最小购买量",
		type: "number",
	}, 
	{
		prop: "max",
		label: "最大购买量",
		type: "number",
	}, 
	{
		prop: "rmb",
		label: "人民币价格",
		type: "number",
	}, 
	{
		prop: "coin",
		label: "知识币价格",
		type: "number",
	}, 
	{
		prop: "bean",
		label: "知识豆价格",
		type: "number",
	}, 
	{
		prop: "callback",
		label: "回调地址",
		type: "string",
	}, 
	],
}
