<template>
	<div class="page-container">
		<div v-if="isExistHeader" class="page-header-container">
			<headers __style__="system"></headers>
		</div>
		<div class="page-body-container">
			<div v-if="pageType == 'notfound-page'">not found</div>
			<users v-else-if="pageType == 'user-profile-page'"  __style__="home" :__default_data__="modData"></users>
			<modules v-else-if="pageType == 'user-page'" __style__="render" :__default_data__="modData"></modules>
			<component v-else :is="modname" :__style__="stylename" :__default_data__="modData"></component>
		</div>
		<div v-if="isExistFooter" class="page-footer-container">
			<footers __style__="system"></footers>
		</div>
	</div>
</template>

<script>
import _ from "lodash";
import wurl from "wurl";

import component from "@/components/component.js";

const getUrl = async function(url) {
	const getPath = async function(url) {
		const hostname = wurl("hostname", url);
		const officialHostname = wurl("hostname", g_app.config.origin);
		let path = wurl("path", url);
		path = path.substring(1);

		if (hostname == officialHostname || hostname.split(".").length < 3) {
			return path;
		}

		let data = await api.domains.getByDomain({domain:hostname});
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

	if (_.startsWith(url, "note/")) return {url, loaded:true, pageType: "system-page"};
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

export default {
	layout: "blank",

	mixins:[component],

	head() {
		return this.head;
	},

	data: function() {
		return {
			loaded: false,
			isNotFound: false,
			pageType: "system-page",
			url:"",
			page:{},
			modname: null,
			stylename:null,
			modData: {},
			head:{},
			isExistHeader:true,
			isExistFooter:false,
		}
	},

	async asyncData({req}) {
		if (!req) return {loaded:false};

		const href = req ? req.ctx.href : window.location.href;
		const data = await loadData(href);

		console.log("服务端加载页面数据:",data);
		return data;
	},

	async mounted() {
		if (!this.loaded) {
			const data = await loadData(window.location.href);
			console.log("客户端加载页面数据:", data);
			_.merge(this, data);
		}

		const params = g_app.storage.sessionStorageGetItem("/" + this.url) || {};
		const query = this.$route.query || {};
		this.modData = {
			...this.modData,
			...params,
			...query,
			setPageAttr: ref => {
				this.head = ref.head || {title:"note"};
				this.isExistHeader = ref.isExistHeader != undefined ? ref.isExistHeader : this.isExistHeader;
				this.isExistFooter = ref.isExistFooter != undefined ? ref.isExistFooter : this.isExistFooter;
			},
		};

		if (this.isPersonalPage) return;

		const paths = this.url.split("/").filter(o => o);
		this.modname = paths[1];
		this.stylename = paths[2] || "index";

		// 设置当前页
		if (this.pageType == "user-page" && this.page) {
			this.setData("__currentUrl__", this.page.url);
			this.setData("__currentContent__", this.page.content);
		}

		console.log(this.modname, this.stylename);
		if (this.pageType == "system-page" && !g_app.mods[this.modname]) this.pageType = "notfound-page"; 
	}
}
</script>

<style scoped>
.page-container {
	display:flex;
	flex-direction: column;
	height:100%;
}
.page-header-container {
	
}
.page-body-container {
	flex:1;
}
.page-footer-container {

}
</style>
