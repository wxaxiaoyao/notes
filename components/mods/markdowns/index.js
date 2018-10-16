
//import index from "./index.vue";
const index = () => import("./index.vue");
import _default from "./default.vue";

export default {
	default: _default,
	index,
};
