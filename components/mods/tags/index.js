
//import index from "./index.vue";
const index = () => import("./index.vue");
const show = () => import("./show.vue");
const input = () => import("./input.vue");

export default {
	index,
	show,
	input,
};
