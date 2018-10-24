
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
	self.search = self.apiRequest("post", "search");
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

export function DataSource(options) {
	const self = this;

	initHttpOptions(self, options);

	const apiRequest = (method, url) => (data, config) => httpRequest(method || "get", url, data, Object.assign(self.options, config));
	
	self.getDefaultDataSource = apiRequest("get", "dataSource/getDefaultDataSource");
	self.getByUsername =  apiRequest("get", "dataSource/getByUsername");
	self.upsert = apiRequest("post", "dataSource/upsert");
	self.delete = apiRequest("delete", "dataSource/delete");
}

export function Issues(options) {
	const self = this;

	initHttpOptions(self, options, "issues");
	self.statistics = self.apiRequest("get", "statistics");
}

export function Trades(options) {
	const self = this;

	initHttpOptions(self, options, "trades");
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
	self.issues = new Issues(self.options);
	self.trades = new Trades(self.options);
	self.notifications = new Notifications(self.options);
	self.messages = new Messages(self.options);
	self.sessions = new Sessions(self.options);
	self.tasks = new Tasks(self.options);
	self.teams = new Teams(self.options);
	self.dailies = new Dailies(self.options);
}

export const options = {
	headers: {},
	cache: process.client,  // 客户端默认开启缓存
}

export default new Notes(options);
