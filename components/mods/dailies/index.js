
const index = () => import("./index.vue");
const upsert = () => import("./upsert.vue");
const _import = () => import("./import.vue");
const team = () => import("./team.vue");
const cellphone = () => import("./cellphone.vue");
const smIndex = () => import("./smIndex.vue");
const smUpsert = () => import("./smUpsert.vue");

export default {
	index,
	upsert,
	import:_import,
	team,
	cellphone,
	smIndex,
	smUpsert,
};
