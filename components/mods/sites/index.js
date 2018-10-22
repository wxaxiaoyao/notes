
const index = () => import("./index.vue");
const setting = () => import("./setting.vue");
const list = () => import("./list.vue");
const detail = () => import("./detail.vue");
const show = () => import("./show.vue");
const create = () => import("./create.vue");

export default {
	index,
	setting,
	list,
	detail,
	show,
	create,
};
