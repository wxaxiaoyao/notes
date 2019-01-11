
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
		label: "项目ID",
		type: "number",
		query: "objectId",
	}, 
];

const favoriteProjectApi = api.resource("favorites", favoriteProject => {
	favoriteProject.extra = favoriteProject.extra || {};
}, favoriteProject => {
	favoriteProject.objectType = 5;
}, {columns});

export default {
	api: favoriteProjectApi,
	columns,
}
