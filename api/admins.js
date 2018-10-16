import axios from "axios";
import pathToRegexp from 'path-to-regexp';

import Error from "./error.js";

export function httpRequest(method, url, data, config = {}) {
	url = pathToRegexp.compile(url)(data || {});
	method = (method || "get").toLowerCase();
	config = {...config, method:method, url:url};
	if (method == "get" || method == "delete" || method == "head" || method == "options") {
		config.params = data;
	} else {
		config.data = data;
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

export class Http {
	static async request(method, url, data, config = {}) {
		return await httpRequest(method, url, data, {...this.config, ...config})	
	}

	constructor(baseUrl, token) {
		this.config = {
			headers: {
				["Authorization"]: "Bearer " + token,
			},
			baseURL: baseUrl,
			withCredentials: true,
		}
	}

	setOptions(options) {
		this.config = options;
	}

	setToken(token) {
		this.config.headers = this.config.headers || {};
		this.config.headers["Authorization"] = "Bearer " + token;
	}

	setBaseUrl(baseURL) {
		this.config.baseURL = baseURL;
	}

	httpRequest(method, url) {
		const self = this;
		return async (data, config = {}) => {
			url = (self.config.baseURL + "/" + url).replace(/\/\//g, "/");
			config = {...self.config, ...config};
			return await httpRequest(method, url, data, config)
		}
	}

	async upsert(data, config = {}) {
		return await httpRequest("POST", 'upsert', data, {...this.config, ...config})	
	}
	async create(data, config = {}) {
		return await httpRequest("POST", '', data, {...this.config, ...config})	
	}

	async update(data, config = {}) {
		return await httpRequest("PUT", ':id', data, {...this.config, ...config})	
	}

	async destroy(data, config = {}) {
		return await httpRequest("DELETE", ':id', data, {...this.config, ...config})	
	}

	async show(data, config = {}) {
		return await httpRequest("GET", ':id', data, {...this.config, ...config})	
	}

	async search(data, config = {}) {
		return await httpRequest("POST", 'search', data, {...this.config, ...config})	
	}

	async list(data, config = {}) {
		return await httpRequest("GET", '', data, {...this.config, ...config})	
	}
}

Http.config = {headers:{}};

class Users extends Http {
	constructor(baseUrl, token) {
		super(baseUrl, token);
	}
}

class Admins extends Http {
	constructor(baseUrl, token) {
		super(baseUrl, token);

		this.users = new Users(`${baseUrl}/users`, token);
		this.sites = new Http(`${baseUrl}/sites`, token);
	}
}

export default Admins;
