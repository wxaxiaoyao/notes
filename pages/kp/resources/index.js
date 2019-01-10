
import api from "../api.js";
import users from "./users.js";
import goods from "./goods.js";
import admins from "./admins.js";
import illegals from "./illegals.js";
import illegalUsers from "./illegalUsers.js";
import caches from "./caches.js";
import projects from "./projects.js";

export default {
	users,
	goods,
	admins,
	illegals,
	illegalUsers,
	caches,
	projects,

	"sites": {
		api: api.resource("sites"),
		columns: [
		{
			prop: "id",
			label: "ID",
			type: "number",
			query: "id-eq",
			sort: true,
		}, 
		{
			api: g_app.admins.users,
			foreignKey:"id",
			prop:"userId",
			aliasprop: "username",
			label:"用户名",
			query: "userId",
		},
		{
			prop: "sitename",
			query: "sitename-like",
			label: "站点名",
			type: "string",
		},
		{
			prop: "visibility",
			aliasprop: "visibilityAlias",
			label: "可见性",
			editable: true,
			query: 'visibility',
			datas: [
			{
				id: 0,
				visibilityAlias: "公开",
			},
			{
				id: 1,
				visibilityAlias: "私有",
			},
			],
		},
		],
	}
}
