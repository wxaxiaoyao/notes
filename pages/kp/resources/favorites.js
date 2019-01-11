
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
		prop: "objectId",
		label: "对象ID",
		type: "number",
		query: "objectId",
	}, 
	{
		prop: "objectType",
		aliasprop: "aliasObjectType",
		label: "对象类型",
		type: "select",
		query: "objectType",
		options: consts.objectType,
	}, 
];

const favoriteApi = api.resource("favorites", favorite => {
	favorite.extra = favorite.extra || {};
}, favorite => {
}, {columns});

export default {
	api: favoriteApi,
	columns,
}
