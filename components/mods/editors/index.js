
const index = () => import("./index.vue");
const codemirror = () => import("./codemirror.vue");
const object = () => import("./object.vue");
const text = () => import("./text.vue");
const link = () => import("./link.vue");
const form = () => import("./form.vue");

export default {
	index,
	codemirror,
	text,
	link,
	form,
	object,
};
