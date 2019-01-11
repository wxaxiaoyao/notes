
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
		label: "被收藏用户ID",
		type: "number",
		query: "objectId",
	}, 
];

const favoriteUserApi = api.resource("favorites", favoriteUser => {
	favoriteUser.extra = favoriteUser.extra || {};
}, favoriteUser => {
	favoriteUser.objectType = 0;
}, {columns});

export default {
	api: favoriteUserApi,
	columns,
}
