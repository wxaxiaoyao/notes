import vue from "vue";
import _ from "lodash";
import jwt from "jwt-simple";
import wurl from "wurl";

import api from "@/api/notes.js";

export const state = () => ({
	isSmallScreen: false,

	// 认证token
	token:null,

	// 模式
	mode: "normal",

	// 路由数据
	pagedata:{},

	// 用户信息
	user: {},

	// 通用数据
	data: {},

	// mod数据
	modsData: {},

	// share data  共享数据 不处理响应式
	
	// msg 消息
	msg: null,  // socket 消息传递
});

const CURRENT_MOD = "__currentMod__";

export const getters = {
	mode: (state) => state.mode,
	pagedata: state => _.cloneDeep(state.pagedata),

	isAuthenticated: (state) => {
		const token = state.token || state.user.token;

		if (!token) return false;
		const payload = jwt.decode(token, null, true);

		if (payload.nbf && Date.now() < payload.nbf*1000) {
			return false;
		}
		if (payload.exp && Date.now() > payload.exp*1000) {
			return false;
		}

		return true;
	},

	token: (state) => state.token || state.user.token,

	user: (state) => _.cloneDeep(state.user),

	msg: (state) => _.cloneDeep(state.msg) || {},

	getData: (state) => (key) => _.cloneDeep(key ? _.get(state.data, key) : state.data),

	getModData: (state) => (key) => _.cloneDeep(key ? _.get(state.modsData, key) : state.modsData),
	getModsData: (state) => state.modsData,

	getCurrentMod: (state) => _.cloneDeep(state.data[CURRENT_MOD] || {}),
	getCurrentModData: (state) => {
		const currentMod = state.data[CURRENT_MOD];
		if (!currentMod || !currentMod.__key__) return {};
		return  _.cloneDeep(_.get(state.modsData, currentMod.__key__) || {});
	}
}

export const actions = {
	nuxtServerInit({commit, state}, {req}) {
		let token = state.token;
		if (process.server && req && req.ctx) {
			token = req.ctx.state.token;
			//console.log(req.ctx.state.token);
			state.token = token;
		}
		
		//if (process.client) {
			//const accessToken = wurl("?access_token", window.location.href);
			//if (accessToken) {
				//token = accessToken;
				//state.token = token;
			//}
		//}

		api.options.headers = _.merge({}, api.options.headers, {
			"Authorization": "Bearer " + token,
		});
	},
}

export const mutations = {
	setPageData(state, data) {
		state.pagedata = data;
	},
	setState(state, obj) {
		_.each(obj, (val, key) => vue.set(state, key, val));
	},
	setMode(state, mode) {
		state.mode = mode;
	},
	setToken(state, token) {
		state.token = token;
	},
	setUser(state, user) {
		state.user = user || {};
		state.token = state.user.token;
	},
	setMsg(state, msg) {
		state.msg = msg;
	},
	setData(state, data) {
		_.each(data, (val, key) => vue.set(state.data, key, val));
	},
	setModsData(state, data) {
		_.each(state.modsData, (val, key) => {
			if (!_.has(data, key)) vue.delete(state.modsData, key);
		});
		_.each(data, (val, key) => {
			if (JSON.stringify(val) == JSON.stringify(state.modsData[key])) return;
			vue.set(state.modsData, key, _.cloneDeep(val));
		});
	},
	setModData(state, data) {
		const modData = _.cloneDeep(data || {});
		_.each(modData, (val, key) => vue.set(state.modsData, key, val));
	},
	setCurrentMod(state, data) {
		vue.set(state.data, CURRENT_MOD, _.cloneDeep(data));
	},
	setCurrentModData(state, data) {
		const currentMod = state.data.__currentMod__;
		if (!currentMod || !currentMod.__mod_key__ || !currentMod.__key__) return;
		const __mod_key__ = currentMod.__mod_key__;
		const __key__ = currentMod.__key__;
		const modData = {};
		_.set(modData,__mod_key__,  _.cloneDeep(state.modsData[__mod_key__]));
		_.set(modData, __key__, _.cloneDeep(data));
		vue.set(state.modsData, __mod_key__, modData[__mod_key__]);
	},
}

