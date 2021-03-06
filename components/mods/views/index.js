
const index = () => import("./index.vue");
const me = () => import("./me.vue");
const entry = () => import("./entry.vue");
const notfound = () => import("./notfound.vue");

export default {
	index,
	me,
	entry,
	notfound,
};
