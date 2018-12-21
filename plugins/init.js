import axios from "axios";
import _ from "lodash";
import vue from "vue";
import elementUI from 'element-ui';
import jwt from "jwt-simple";
import wurl from "wurl";

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

const portraits = {};
for (let i = 0; i < 26; i++) {
	for (let j = 1; j <= 4; j++) {
		const key = "abcdefghijklmnopqrstuvwxyz"[i] + j;
		const url = "http://statics.qiniu.wxaxiaoyao.cn/_/portraits/" +  key + ".png";
		portraits[key] = url;
	}
}
app.portraits = portraits;

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

export default ({store, req, env}) => {
	app.store = store;

	if (req && req.ctx && ((req.ctx.state && req.ctx.state.token) || req.ctx.query.access_token)) {
		const token = req.ctx.state.token || req.ctx.query.access_token;
		req.ctx.state.token = token;
		api.options.headers["Authorization"] = "Bearer " + token;
	}

	if (process.client && store.state.token) {
		//initSocket(store.state.token);
	} 
}
