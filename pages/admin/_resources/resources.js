
export default {
	"users": {
		api: g_app.admins.users,
		columns: [
		{
			prop: "id",
			label: "ID",
			type: "number",
		},
		{
			prop: "username",
			label: "用户名",
			type: "string",
			editable: true,
		},
		{
			prop: "passwod",
			label: "密码",
			isHide: true,
		},
		],
	},

	"sites": {
		api: g_app.admins.sites,
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
