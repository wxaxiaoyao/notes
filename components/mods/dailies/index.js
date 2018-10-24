
const index = () => import("./index.vue");
const _new = () => import("./new.vue");
const _import = () => import("./import.vue");

export default {
	index,
	new:_new,
	import:_import,
};
