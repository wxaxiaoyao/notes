
//import index from "./index.vue";
const index = () => import("./index.vue");
const show = () => import("./show.vue");
const system = () => import("./system.vue");
const login = () => import("./login.vue");
const register = () => import("./register.vue");

export default {
	index,
	show,
	system,
	login,
	register,
};
