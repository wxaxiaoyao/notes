
//import index from "./index.vue";
const index = () => import("./index.vue");
const show = () => import("./show.vue");

export default {
	index,
	show,
};
