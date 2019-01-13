
import _ from "lodash";
import api from "../api.js";

const columns = [
	{
		prop: "id",
		label: "ID",
		type: "number",
		query: "id-eq",
	}, 
	{
		prop: "userId",
		label: "用户ID",
		type: "number",
		query: "userId",
	}, 
	{
		prop: "orderNo",
		label: "订单号",
		type: "string",
		query: "orderNo",
	}, 
	{
		prop: "amount",
		label: "充值金额",
		type: "number",
	}, 
	{
		prop: "state",
		aliasprop: "aliasState",
		label: "状态",
		type: "select",
		options: [
		{label:"充值开始", value:0},
		{label:"充值中", value:1},
		{label:"充值成功", value:256},
		{label:"充值失败", value:512},
		]
	}, 
	{
		prop: "channel",
		aliasprop: "aliasChannel",
		label: "渠道",
		type: "select",
		options: [
		{label:"微信支付", value:"wx_pub_qr"},
		{label:"微信支付", value:"alipay_qr"},
		],
	}, 
	{
		prop: "tradeId",
		label: "交易ID",
		type: "number",
	}, 
];

const orderApi = api.resource("orders", order => {
	order.extra = order.extra || {};
}, order => {
	order.extra = order.extra || {};
}, {columns});

export default {
	api: orderApi,
	columns,
}
