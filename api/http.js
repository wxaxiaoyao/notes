
import _ from "lodash";
import axios from "axios";
import pathToRegexp from 'path-to-regexp';

import Error from "./error.js";

const caches = {};
class Cache {
	constructor(key, config) {
		this.key = key;   // 请求key
		this.cblist = []; // promise 回调列表 {resolve, reject}
		this.state = 0;   // 0 -- 初始状态  1 -- 请求中  2 -- 请求完成
		this.data = null; // 请求结果
		this.config = config;
	}

	finish(data, success = true) {
		_.each(this.cblist, cb => success ? cb.resolve(_.cloneDeep(data)) : cb.reject(_.cloneDeep(data)));
		this.state = 2;
		this.data = _.cloneDeep(data);
		this.expire = (new Date()).getTime() + 1000 * 3 * 1; // 默认缓存5分钟
		this.cblist = [];
	}

	async request(config) {
		const self = this;
		const curtime = (new Date()).getTime();

		// 请求已完成
		if (self.state == 2) {
			// 没有过期
			if (curtime < self.expire) {
				console.log("使用缓存数据:", config.url);
				return Promise.resolve(_.cloneDeep(self.data));
			}	

			// 过期重置状态
			self.state = 0;
		}

		// 模拟虚拟请求
		if (self.state == 1) {
			console.log("共用请求数据:", config.url);
			return await (new Promise((resolve, reject) => self.cblist.push({resolve, reject})));	
		}

		// 初始状态, 则请求并置请求中状态
		self.state = 1;  // 设置状态为请求中

		return await axios.request(config || self.config).then(res => {
			const result = new Error(res.data, res.status, res.headers);
			result.total = parseInt(res.headers["x-total"]);

			self.finish(result, true);

			console.log("请求数据:", config.url);
			return result;
		}).catch(e => {
			let result = {};
			if (e.response) {
				result = new Error(e.response.data, e.response.status, e.response.headers);
			} else if (e.request) {
				result = new Error("网络异常, 请稍后尝试!!!", 500);
			} else {
				result = new Error("客户端内部错误!!!", 400);
			}

			self.finish(result, false);

			return result;
		});
	}

	static get(key) {
		caches[key] = caches[key] || new Cache(key);

		return caches[key];
	}
}

export function httpRequest(method, url, data, config) {
	url = pathToRegexp.compile(url)(data || {});
	method = (method || "get").toLowerCase();
	config = {...(config || {}), method:method, url:url};
	if (method == "get" || method == "delete" || method == "head" || method == "options") {
		config.params = data;
	} else {
		config.data = data;
	}

	// cache get
	if (method == "get" && config.cache) {
		const key = url + JSON.stringify(config.params);
		const cache = Cache.get(key, config);
		return cache.request(config);
	}

	return axios.request(config).then(res => {
		const result = new Error(res.data, res.status, res.headers);
		result.total = parseInt(res.headers["x-total"]);
		return result;
	}).catch(e => {
		if (e.response) {
			return new Error(e.response.data, e.response.status, e.response.headers);
		} else if (e.request) {
			return new Error("网络异常, 请稍后尝试!!!", 500);
		} else {
			return new Error("客户端内部错误!!!", 400);
		}
	});
}

export const httpGet = (url, data, config) => httpRequest("get", url, data, config);
export const httpPost = (url, data, config) => httpRequest("post", url, data, config);
export const httpPut = (url, data, config) => httpRequest("put", url, data, config);
export const httpDelete = (url, data, config) => httpRequest("delete", url, data, config);


export default httpRequest;
