
import _ from "lodash";
import axios from "axios";

import Error from "./error.js";


function success(res) {
	return new Error(res.data, res.status, res.headers);
}

function fail(res) {
	return new Error(res.response.data, res.response.status, res.response.headers);
}


class Api {
	constructor(config, options) {
		this.http = axios.create(config);
		this.config = config;
		this.options = options;
		this.resources = {};
	}

	setToken(token) {
		this.http.defaults.headers.common['Authorization'] = "Bearer " + token;
	}

	async login(params) {
		return await this.http.post("admins/login", params).then(res => res.data).catch(e => e.response.data);
	}

	formatColumns(columns) {
		const self = this;
		_.each(columns, o => {
			const typeMinWidths = {"number":"80px", "select":"100px", "string":"160px", "text":"220px"};
			o.minWidth = o.minWidth || typeMinWidths[o.type];

			if (!o.resource || !o.resource.name || !o.resource.srckey || !o.resource.dstkey || !o.resource.dstval) return;
			const {name, srckey, dstkey, dstval} = o.resource;

			o.search = async (value) => {
				const sql = `select ${dstkey} as value, ${dstval} as label from ${name} where ${dstval} like '%${value}%'`;
				const list = await self.query({sql});
				o.options = list;
			}
		});
	}

	async loadRelateData(list, columns){
		const self = this;
		const datas = {};

		// 收集需要加载的资源
		_.each(columns, o => {
			if (!o.resource || !o.resource.name || !o.resource.srckey || !o.resource.dstkey || !o.resource.dstval) return;
			const {name, srckey, dstkey, dstval} = o.resource;
			const key = name + "-" + dstkey;

			datas[key] = datas[key] || {name: name, key: dstkey, keys:[], cols:[]};
			const data = datas[key];

			data.cols.push({prop: o.prop, srckey, dstkey, dstval, column:o,});

			_.each(list, item => data.keys.push(item[srckey]));
			_.uniq(data.keys);
		});

		// 加载资源
		for (let key in datas) {
			const {name, key, keys, cols} = datas[key];
			const keystr = keys.join(",");
			const sql = `select * from ${name} where ${key} in (${keystr})`;
			const values = await self.query({sql});
			_.each(cols, col => {
				col.options = col.options || values;
				const {srckey, dstkey, dstval, prop} = col; 
				_.each(list, item => {
					const srcval = item[srckey];
					const index = _.findIndex(values, o => o[dstkey] == srcval);
					if (index < 0) return;
					item[prop] = values[index][dstval];
				});
			});
		}

		// 设置别名
		_.each(list, item => {
			_.each(columns, col => {
				if (col.type != "select" || !col.aliasprop || !col.options) return;
				const aliaspropIndex = _.findIndex(col.options, o => o.value == item[col.prop]);
				if (aliaspropIndex < 0) return;
				item[col.aliasprop] = col.options[aliaspropIndex]["label"];
			});
		});
	}

	async query(params = {}) {
		return await this.http.post("admins/query", params).then(res => res.data || []).catch(e => []);
	}

	resource(name, {formatIn, formatOut, columns}) {
		const self = this;

		self.formatColumns(columns);

		self.resources[name] = {
			async create(params = {}) {
				formatOut && formatOut(params, "create");
				const result = await self.http.post(`admins/${name}`, params).then(success).catch(fail);
				if (result.isOk()) formatIn && formatIn(result.data, "create");
				return result;
			},
			async destroy(params = {}) {
				formatOut && formatOut(params, "destroy");
				return await self.http.delete(`admins/${name}/${params.id}`, {params}).then(success).catch(fail);
			},
			async update(params = {}) {
				formatOut && formatOut(params, "update");
				return await self.http.put(`admins/${name}/${params.id}`, params).then(success).catch(fail);
			},
			async show(params = {}) {
				formatOut && formatOut(params, "show");
				return await self.http.get(`admins/${name}/${id}`).then(success).catch(fail);
			},
			async search(params = {}) {
				formatOut && formatOut(params, "search");
				const result = await self.http.post(`admins/${name}/search`, params).then(success).catch(fail);
				if (result.isErr()) return result;

				result.total = result.data.count;
				result.data = result.data.rows;

				_.each(result.data, o => formatIn && formatIn(o, "search"));

				await self.loadRelateData(result.data, columns);
				//options.search && options.search(result.data);
				return result;
			},
			async upsert(params = {}) {
				if (params.id) {
					return await this.update(params);
				} else {
					return await this.create(params);
				}
			},
		}

		return self.resources[name];
	}
}

export default Api;
