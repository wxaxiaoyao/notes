import _ from "lodash";
import axios from "axios";

import Error from "./error.js";
const baseURL = "http://localhost:8081/api/v0/";

const http = axios.create({
	baseURL,
	headers: {
	},
});


function success(res) {
	return new Error(res.data, res.status, res.headers);
}

function fail(res) {
	return new Error(res.response.data, res.response.status, res.response.headers);
}

export default {
	setToken(token) {
		http.defaults.headers.common['Authorization'] = "Bearer " + token;
	},

	async login(params) {
		return await http.post("admins/login", params).then(res => res.data).catch(e => e.response.data);
	},

	async query(params = {}) {
		return await http.post("admins/query", params).then(success).catch(fail);
	},

	resource(name, toIn, toOut) {
		return {
			async getById({id}) {
				return await http.get(`admins/${name}/${id}`).then(success).catch(fail);
			},

			async get(params = {}) {
				const result = await http.post(`admins/${name}/search`, params).then(success).catch(fail);
				if (result.isErr()) return result;
				result.total = result.data.count;
				result.data = result.data.rows;

				_.each(result.data, o => toIn && toIn(o));

				return result;
			},

			async search(params = {}) {
				toOut && toOut(params);
				return await this.get(params);
			},

			async delete(params = {}) {
				toOut && toOut(params);
				return await http.delete(`admins/${name}`, {params}).then(success).catch(fail);
			},

			async update(params = {}) {
				toOut && toOut(params);
				return await http.put(`admins/${name}/${params.id}`, params).then(success).catch(fail);
			},

			async create(params = {}) {
				toOut && toOut(params);
				return await http.post(`admins/${name}`, params).then(success).catch(fail);
			},

			async upsert(params = {}) {
				toOut && toOut(params);
				if (params.id) {
					return await this.update(params);
				} else {
					return await this.create(params);
				}
			},
		}
	},
}
