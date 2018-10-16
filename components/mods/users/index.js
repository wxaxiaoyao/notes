
//import index from "./index.vue";
const index = () => import("./index.vue");
const show = () => import("./show.vue");
const system = () => import("./system.vue");

export default {
	index,
	show,
	system,
};
