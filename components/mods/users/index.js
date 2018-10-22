
//import index from "./index.vue";
const index = () => import("./index.vue");
const show = () => import("./show.vue");
const system = () => import("./system.vue");
const home = () => import("./home.vue");
const login = () => import("./login.vue");
const register = () => import("./register.vue");
const setting = () => import("./setting.vue");
const profile = () => import("./profile.vue");
const account = () => import("./account.vue");

export default {
	index,
	show,
	system,
	login,
	register,
	setting,
	profile,
	account,
	home,
};
