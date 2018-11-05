import axios from "axios";
import _ from "lodash";
import vue from "vue";
import elementUI from 'element-ui';
import io from "socket.io-client";
import jwt from "jwt-simple";

import util from "@/lib/util.js";
import consts from "@/lib/consts.js";
import components from  "@/components/index.js";
import config from "@/config.js";
import api from "@/api/notes.js";
import admins from "@/api/admins.js";
import mdconf from "@/lib/markdown/mdconf.js";

const {mods} = components;

vue.use(elementUI);

api.options.baseURL = config.apiUrlPrefix;
api.options.withCredentials = true;
//console.log(api.options.baseURL);

function initServer() {
	global.g_app = global.g_app || {};
	global._ = _;

	const app = global.g_app;

	return app;
}

function initClient() {
	window.g_app = window.g_app || {};
	window._ = _;
	const app = window.g_app;

	app.vues = vue;
	app.vue = new vue();

	return app;
}

function init() {
	let app = undefined;
	if (process.server)
		app = initServer();
	else 
		app = initClient();

	return app;
}

export const app = init();

app.mdconf = mdconf;
app.datas = {};
app.config = config;
app.consts = consts;
app.util = util;
app.api = api;
app.admins = new admins(config.apiUrlPrefix + "admins");
app.mods = mods;

app.setData = function(key, data) {
	app.datas[key] = data;
}

app.getData = function(key, defaultValue) {
	if (app.datas[key] == undefined) app.datas[key] = defaultValue;

	return app.datas[key];
}

function initSocket(token) {
	const user = jwt.decode(token, null, true);
	if (!user || !user.userId) { 
		console.log("token 无效", token);
		return;
	}

	if (app.socket && app.socket.connected) {
		console.log("socket already connected");
		return;
	}

	const socket = io(config.socketUrl, {
		query: {
			token: token,
			userId: user.id || user.userId,
		},
		transports: ['websocket'],
	});

	socket.on("connect", () => {
		console.log("socket connect successful", socket);
	});

	socket.on("disconnect", msg => {
		console.log("socket disconnect", msg);
		app.socket = undefined;
	});

	socket.on("error", e => {
		console.log("socket error", e);
	});

	app.socket = socket;
}
app.initSocket = initSocket;

export default ({store, req, env}) => {
	app.store = store;

	if (req && req.ctx && req.ctx.state && req.ctx.state.token) {
		const token = req.ctx.state.token;
		api.options.headers["Authorization"] = "Bearer " + token;
	}

	if (process.client && store.state.token) {
		//initSocket(store.state.token);
	} 
}
