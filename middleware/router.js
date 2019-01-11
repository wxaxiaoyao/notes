
import _ from "lodash";
import wurl from "wurl";
import api from "../api/notes.js";

const domains = {
	"kpadmin.wxaxiaoyao.cn": "/note/kpadmin",
	"kpadmin.xiaoyao.com": "/note/kpadmin",
};

const getUrl = async function(url) {
	const getPath = async function(url) {
		const hostname = wurl("hostname", url);
		const domain = hostname.split(":")[0];
		let path = wurl("path", url);

		if (domains[domain]) {
			if (path.indexOf(domains[domain]) != 0) {
				path = domains[domain] + path;
			}
			return path.substring(1);
		}

		path = path.substring(1);
		// 屏蔽域名解析
		return path;

		if (domain.split(".").length < 3) {
			return path;
		}

		let data = await api.domains.getByDomain({domain});
		data = data.getData();

		if (data && data.user && data.site) {
			path = data.user.username + "/" + data.site.sitename + "/" + path;
		}

		return path;
	}

	let path = await getPath(url);
	if (path[path.length-1] == "/") path = path + "index";

	return decodeURIComponent(path);
}

const loadData = async function(full_url) {
	const url = await getUrl(full_url);
	console.log("当前URL:", url);

	if (_.startsWith(url, "_nuxt/")) return {url, loaded:true, pageType:"notfound-page"};
	if (_.startsWith(url, "note/")) return {url, loaded:true, pageType: "system-page"};
	if (url == "") return {url, loaded: true, pageType:"index-page"};
	if (url.indexOf("/") < 0) return {url, loaded: true, pageType:"user-profile-page", modData:{username:url}};

	const result = await g_app.api.pages.visit({url});
	if (result.isErr()) return {url, loaded: true, pageType:"notfound-page"};
	const data = result.data || {};
	const page = data.page;
	const head =  {
		meta: [
			{hid:"keywords", name:"keywords", content: page.keywords},
			{hid:"description", name:"description", content: page.description},
		],
		noscript: [
			{innerHTML: page.content},
		]
	};

	if (page.title) head.title = page.title;
	const content = page.content || "";

	return {
		url,
		loaded: true,
		pageType: "user-page",
		modData:{text: content},
		head,
		page,
	};
}

export default async function({store, req, redirect, route}) {
	const href = req ? req.ctx.href : window.location.origin + route.fullPath;
	console.log("URL:", href, route);
	const data = await loadData(href);

	store.commit("setPageData", data);
}
