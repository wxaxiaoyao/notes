

//import index from "./index.vue";
const index = () => import("./index.vue");
const system = () => import("./system.vue");
const editor = () => import("./editor.vue");
const userpage = () => import("./userpage.vue");

export default {
	index,
	system,
	editor,
	userpage,
};
