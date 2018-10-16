
const index = () => import("./index.vue");
const list = () => import("./list.vue");
const new_ = () => import("./new.vue");

export default {
	index,
	list,
	"new": new_,
};
