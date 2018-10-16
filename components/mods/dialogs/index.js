
const index = () => import("./index.vue");
const confirm = () => import("./confirm.vue");
const rename = () => import("./rename.vue");
const confirmpwd = () => import("./confirmpwd.vue");
const pageSetting = () => import("./pageSetting.vue");
const newpage = () => import("./newpage.vue");

export default {
	index,
	confirm,
	rename,
	confirmpwd,
	pageSetting,
	newpage,
};
