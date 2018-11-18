
const index = () => import("./index.vue");
const me = () => import("./me.vue");
const entry = () => import("./entry.vue");
const login = () => import("./login.vue");
const note = () => import("./note.vue");

export default {
	index,
	me,
	entry,
	login,
	note,
};
