
const index = () => import("./index.vue");
const upsert = () => import("./upsert.vue");
const _import = () => import("./import.vue");
const team = () => import("./team.vue");

export default {
	index,
	upsert,
	import:_import,
	team,
};
