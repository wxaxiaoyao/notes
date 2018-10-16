import axios from "axios";
import pathToRegexp from 'path-to-regexp';

import {Err} from "./error.js";

export function httpRequest(method, url, data, config) {
	url = pathToRegexp.compile(url)(data || {});
	method = (method || "get").toLowerCase();
	config = {...(config || {}), method:method, url:url};
	if (method == "get" || method == "delete" || method == "head" || method == "options") {
		config.params = data;
	} else {
		config.data = data;
	}

	return axios.request(config)
		.then(res => {
			return new Err(res.data.code, res.data.message, res.data)
		})
		.catch(res => {
			return new Err(-1, res.message);
		});
}

export const httpGet = (url, data, config) => httpRequest("get", url, data, config);
export const httpPost = (url, data, config) => httpRequest("post", url, data, config);
export const httpPut = (url, data, config) => httpRequest("put", url, data, config);
export const httpDelete = (url, data, config) => httpRequest("delete", url, data, config);

function initHttpOptions(self, options = {}, prefix) {
	options.headers = options.headers || {};
	
	self.options = options;
	self.httpGet = httpGet;
	self.httpPost = httpPost;
	self.httpPut = httpPut;
	self.httpDelete = httpDelete;
	self.apiRequest = (method = "get", url) => (data, config) => httpRequest(method, prefix + (url ? "/" + url : ""), data, Object.assign(self.options, config));

	// api api
	self.upsert = self.apiRequest("post", "upsert");
	self.create = self.apiRequest("post");
	self.update = self.apiRequest("put", ":id");
	self.delete = self.apiRequest("delete", ":id");
	self.getById = self.apiRequest("get", ":id");
	self.get = self.apiRequest("get");
	self.find = self.apiRequest("get");
}

export function Users(options) {
	const self = this;

	initHttpOptions(self, options, "users");

	self.login = self.apiRequest("post", "login");
	self.logout = self.apiRequest("post", "logout");
	self.register = self.apiRequest("post", "register");
	self.changepwd = self.apiRequest("post", "pwd");
	self.cellphoneVerifyOne = self.apiRequest("get", "cellphone_captcha");
	self.cellphoneVerifyTwo = self.apiRequest("post", "cellphone_captcha");
	self.emailVerifyOne = self.apiRequest("post", "email_captcha");
	self.emailVerifyTwo = self.apiRequest("post", "email_captcha");
	self.getByUsername = self.apiRequest("get", ":username");
	self.getDetailByUsername = self.apiRequest("get", ":username");
}

export function Sites(options) {
	const self = this;

	initHttpOptions(self, options, "sites");

	self.createGroup = self.apiRequest("POST", ":id/groups");
	self.updateGroup = self.apiRequest("PUT", ":id/groups");
	self.deleteGroup = self.apiRequest("DELETE", ":id/groups");
	self.groups = self.apiRequest("GET", ":id/groups");
}

export function Groups(options) {
	const self = this;

	initHttpOptions(self, options, "groups");

	self.createMember = self.apiRequest("POST", ":id/members");
	self.deleteMember = self.apiRequest("DELETE", ":id/members");
	self.members = self.apiRequest("GET", ":id/members");
}

export function Files(options) {
	const self = this;
	const prefix = "files";

	initHttpOptions(self, options, "files", "key");

	self.get = self.apiRequest("get");
	self.delete = self.apiRequest("delete", ":key") 
	self.token = self.apiRequest("get", ":key/token");
	self.qiniu = self.apiRequest("post", "qiniu");
}

export function Pages(options) {
	const self = this;

	initHttpOptions(self, options, "pages", "id");

	self.visit = self.apiRequest("get", "visit");
	self.getSetting = self.apiRequest("get", ":id/setting");
	self.setSetting = self.apiRequest("post", ":id/setting");
}

export function GroupMembers(options) {
	const self = this;

	initHttpOptions(self, options, "group_members", "id");
}

export function SiteGroups(options) {
	const self = this;

	initHttpOptions(self, options, "site_groups", "id");
}

export function SiteMembers(options) {
	const self = this;

	initHttpOptions(self, options, "site_members", "id");
}

export function OauthUsers(options) {
	const self = this;

	initHttpOptions(self, options, "oauth_users", "id");
}

export function Favorites(options) {
	const self = this;

	initHttpOptions(self, options, "favorites");
	self.follows = self.apiRequest("get", "follows");
	self.exist = self.apiRequest("get", "exist");
}

export function Domains(options) {
	const self = this;

	initHttpOptions(self, options, "favorites", "id");
}

export function Comments(options) {
	const self = this;

	initHttpOptions(self, options, "comments", "id");

	self.getPageCommentsByPageId = self.apiRequest("get", "getPageCommentsByPageId");
	self.createPageComment = self.apiRequest("post", "createPageComment");
}

export function Modules(options) {
	const self = this;

	initHttpOptions(self, options, "modules", "id");

	self.getByName = self.apiRequest("get", "getByName");
}

export function Tags(options) {
	const self = this;

	initHttpOptions(self, options, "tags");
}

export function DataSource(options) {
	const self = this;

	initHttpOptions(self, options);

	const apiRequest = (method, url) => (data, config) => httpRequest(method || "get", url, data, Object.assign(self.options, config));
	
	self.getDefaultDataSource = apiRequest("get", "dataSource/getDefaultDataSource");
	self.getByUsername =  apiRequest("get", "dataSource/getByUsername");
	self.upsert = apiRequest("post", "dataSource/upsert");
	self.delete = apiRequest("delete", "dataSource/delete");
}

export function Notes(options = {}){
	const self = this;
	initHttpOptions(self, options);

	self.dataSource = new DataSource(self.options);
	self.users = new Users(self.options);
	self.files = new Files(self.options);
	self.sites = new Sites(self.options);
	self.pages = new Pages(self.options);
	self.groups = new Groups(self.options);
	self.groupMembers = new GroupMembers(self.options);
	self.siteGroups = new SiteGroups(self.options);
	self.siteMembers = new SiteMembers(self.options);
	self.oauthUsers = new OauthUsers(self.options);
	self.favorites = new Favorites(self.options);
	self.domains = new Domains(self.options);
	self.comments = new Comments(self.options);
	self.modules = new Modules(self.options);
	self.tags = new Tags(self.options);
}

export const options = {
	headers: {},
}

export default new Notes(options);
