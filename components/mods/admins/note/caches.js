
import _ from "lodash";
import moment from "moment";

import api from "./api.js";

const columns = [
	{
		prop: "id",
		label: "ID",
		type: "number",
	}, 
	{
		prop: "key",
		label: "KEY",
		type: "string",
		query: "key",
	}, 
	{
		prop: "expire",
		label: "过期时间",
		type: "number",
	}, 
	{
		prop: "value",
		label: "值",
		type: "text",
	}, 
];

const cacheApi = api.resource("caches", {
	formatIn: cache => {
		cache.value = JSON.stringify(cache.value);
		cache.expire = moment(cache.expire).format("YYYY-MM-DD hh:mm:ss");
	},
	columns,
});

export default {
	api: cacheApi,
	columns,
}
