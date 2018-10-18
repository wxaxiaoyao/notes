
const index = () => import("./index.vue");
const codemirror = () => import("./codemirror.vue");
const editor = () => import("./editor.vue");
const object = () => import("./object.vue");
const text = () => import("./text.vue");
const link = () => import("./link.vue");
const form = () => import("./form.vue");

export default {
	index,
	codemirror,
	editor,
	text,
	link,
	form,
	object,
};
