
//import index from "./index.vue";
const index = () => import("./index.vue");
const editor = () => import("./editor.vue");

export default {
	index,
	editor,
};
