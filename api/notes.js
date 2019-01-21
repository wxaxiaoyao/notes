import * as qiniu from "qiniu-js";

import httpRequest from "./http.js";

function initHttpOptions(self, options = {}, prefix) {
	options.headers = options.headers || {};
	
	self.options = options;
	//self.httpGet = httpGet;
	//self.httpPost = httpPost;
	//self.httpPut = httpPut;
	//self.httpDelete = httpDelete;
	self.apiRequest = (method = "get", url) => (data, config = {}) => httpRequest(method, prefix + (url ? "/" + url : ""), data, {...self.options, ...config});

	// api api
	self.filter = self.apiRequest("post", "filter");
	self.search = self.apiRequest("post", "search");
	self.count = self.apiRequest("get", "count");
	self.upsert = self.apiRequest("post", "upsert");
	self.create = self.apiRequest("post");
	self.update = self.apiRequest("put", ":id");
	self.delete = self.apiRequest("delete", ":id");
	self.destroy = self.delete;
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
	self.changepwd = self.apiRequest("post", "changepwd");
	self.confirmpwd = self.apiRequest("post", "confirmpwd");
	self.cellphoneVerifyOne = self.apiRequest("get", "cellphone_captcha");
	self.cellphoneVerifyTwo = self.apiRequest("post", "cellphone_captcha");
	self.emailVerifyOne = self.apiRequest("post", "email_captcha");
	self.emailVerifyTwo = self.apiRequest("post", "email_captcha");
	self.getByUsername = self.apiRequest("get", ":username");
	self.detail = self.apiRequest("get", ":username/detail");
	self.contribution = self.apiRequest("get", ":id/contribution");
	self.contacts = self.apiRequest("get", "contacts");
}

export function Sites(options) {
	const self = this;

	initHttpOptions(self, options, "sites");

	self.detail = self.apiRequest("GET", ":id/detail");
	self.getByName = self.apiRequest("GET", "get_by_name");
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

	initHttpOptions(self, options, "files");

	self.statistics = self.apiRequest("get", "statistics");
	self.rename = self.apiRequest("post", ":id/rename");
	self.token = self.apiRequest("get", "token");
	self.qiniu = self.apiRequest("post", "qiniu");
	self.rawurl = self.apiRequest("get", "rawurl");
	self.batchDelete = self.apiRequest("post", "batchDelete");
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
	self.destroy = self.apiRequest("delete", "");
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

export function Issues(options) {
	const self = this;

	initHttpOptions(self, options, "issues");
	self.statistics = self.apiRequest("get", "statistics");
}

export function Trades(options) {
	const self = this;

	initHttpOptions(self, options, "trades");

	self.getPayQR = self.apiRequest("get", ":id/payQR");
}

export function Orders(options) {
	const self = this;

	initHttpOptions(self, options, "orders");
}

export function Notifications(options) {
	const self = this;

	initHttpOptions(self, options, "notifications");
}

export function Messages(options) {
	const self = this;

	initHttpOptions(self, options, "messages");
}

export function Sessions(options) {
	const self = this;

	initHttpOptions(self, options, "sessions");

	self.sendMsg = self.apiRequest("post", ":id/msgs");
	self.getMsgs = self.apiRequest("get", ":id/msgs");
	self.current = self.apiRequest("post", ":id/current");
}

export function Tasks(options) {
	const self = this;

	initHttpOptions(self, options, "tasks");
}

export function Teams(options) {
	const self = this;

	initHttpOptions(self, options, "teams");

	self.addMember = self.apiRequest("POST", ":id/members");
	self.removeMember = self.apiRequest("DELETE", ":id/members");
	self.members = self.apiRequest("GET", ":id/members");
	self.dailies = self.apiRequest("GET", ":id/dailies");
	self.exit = self.apiRequest("POST", ":id/exit");
	self.all = self.apiRequest("GET", "all");
}

export function Dailies(options) {
	const self = this;

	initHttpOptions(self, options, "dailies");
	self.import = self.apiRequest("post", "import");
}

export function Suggestions(options) {
	const self = this;

	initHttpOptions(self, options, "suggestions");
}

export function Links(options) {
	const self = this;

	initHttpOptions(self, options, "links");
}

export function Demands(options) {
	const self = this;

	initHttpOptions(self, options, "demands");
}

export function Fields(options) {
	const self = this;

	initHttpOptions(self, options, "fields");
}

export function Apis(options) {
	const self = this;

	initHttpOptions(self, options, "apis");

	self.getConfig = self.apiRequest("get", "configs");
	self.setConfig = self.apiRequest("post", "configs");
}

export function Questions(options) {
	const self = this;

	initHttpOptions(self, options, "questions");
}

export function Todos(options) {
	const self = this;

	initHttpOptions(self, options, "todos");
}

export function Projects(options) {
	const self = this;

	initHttpOptions(self, options, "projects");
}

export function Bugs(options) {
	const self = this;

	initHttpOptions(self, options, "bugs");
}

export function Experiences(options) {
	const self = this;

	initHttpOptions(self, options, "experiences");
}

export function Qinius(options) {
	const self = this;

	initHttpOptions(self, options, "qinius");

	self.token = self.apiRequest("get", "token");
	self.upload = async (options = {}) => {
		let {filename, file="", visibility="public", params={}, next, error, complete} = options;
		let result = await self.token(filename);
		const {token, key, url} = result.data || {};
		if (!token || !key) return ;
		const opts = {token, putExtra:{mimeType:null, params}, config:{useCdnDomain: true}};
		if (typeof(file) == "string") file = new Blob([file], {type: "text/plain"});
	
		const observable = qiniu.upload(file, key, token, {mimeType:null, params}, {useCdnDomain:true});

		result = await new Promise((resolve, reject) => {
			observable.subscribe({
				next(res) {
					next && next(res);
				},
				error(err) {
					error && error(err);
					resolve();
				},
				complete(res) {
					complete && complete(res);
					resolve({key:res.key, size: res.fsize, hash: res.hash});
				},
			})
		});

		if (!result) {
			console.log("上传文件失败");
			return;
		};

		return url;
	}
}

export function Notes(options) {
	const self = this;

	initHttpOptions(self, options, "notes");
}

export function ClassifyTags(options) {
	const self = this;

	initHttpOptions(self, options, "classifyTags");
}

export function __Notes__(options = {}){
	const self = this;
	initHttpOptions(self, options);

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
	self.issues = new Issues(self.options);
	self.trades = new Trades(self.options);
	self.orders = new Orders(self.options);
	self.notifications = new Notifications(self.options);
	self.messages = new Messages(self.options);
	self.sessions = new Sessions(self.options);
	self.tasks = new Tasks(self.options);
	self.teams = new Teams(self.options);
	self.dailies = new Dailies(self.options);
	self.suggestions = new Suggestions(self.options);
	self.links = new Links(self.options);
	self.demands = new Demands(self.options);
	self.fields = new Fields(self.options);
	self.apis = new Apis(self.options);
	self.questions = new Questions(self.options);
	self.todos = new Todos(self.options);
	self.projects = new Projects(self.options);
	self.bugs = new Bugs(self.options);
	self.experiences = new Experiences(self.options);
	self.qinius = new Qinius(self.options);
	self.notes = new Notes(self.options);
	self.classifyTags = new ClassifyTags(self.options);
}

export const options = {
	headers: {},
	cache: process.client,  // 客户端默认开启缓存
}

export default new __Notes__(options);
