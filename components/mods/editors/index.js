
const index = () => import("./index.vue");
const codemirror = () => import("./codemirror.vue");
const editor = () => import("./editor.vue");
const simple = () => import("./simple.vue");
const cellphone = () => import("./cellphone.vue");
const draft = () => import("./draft.vue");
const object = () => import("./object.vue");
const text = () => import("./text.vue");
const link = () => import("./link.vue");
const form = () => import("./form.vue");

export default {
	index,
	codemirror,
	editor,
	simple,
	cellphone,
	draft,
	text,
	link,
	form,
	object,
};
