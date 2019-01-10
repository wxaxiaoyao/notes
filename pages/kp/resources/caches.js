
import _ from "lodash";
import api from "../api.js";
import moment from "moment";

const cacheApi = api.resource("caches", cache => {
	cache.value = JSON.stringify(cache.value);
	cache.expire = moment(cache.expire).format("YYYY-MM-DD hh:mm:ss");
}, cache => {
});

export default {
	api: cacheApi,

	columns: [
	{
		prop: "id",
		label: "ID",
		type: "number",
		sort: true,
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
	],
}
