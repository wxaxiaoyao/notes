<template>
	<div>
		<mods v-if="!isNotFound" :text="content"></mods>
		<notfound v-if="isNotFound"></notfound>
	</div>
</template>

<script>
import _ from "lodash";
import {
	Message,
} from "element-ui";

import config from "@/config.js";
import wurl from "wurl";
import notfound from "@/components/views/notfound.vue";
import component from "@/components/component.js";


const getUrl = async function(url) {
	//console.log(url);
	const getPath = async function(url) {
		const hostname = wurl("hostname", url);
		const officialHostname = wurl("hostname", config.origin);
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

export default {
	layout: "userpage",

	mixins:[component],

	components: {
		notfound,
	},

	data: function() {
		return {
			isNotFound: false,
			url: null,
			content: "",
			page: {},
		}
	},

	head() {
		const page = this.page;
		const head =  {
			meta: [
				{hid:"keywords", name:"keywords", content:page.keywords},
				{hid:"description", name:"description", content: page.description},
			],
			noscript: [
				{innerHTML: page.content},
			]
		};

		if (page.title) head.title = page.title;

		return head;
	},

	async asyncData({req, store}) {
		const href = req.ctx.href;
		const url = await getUrl(href);
		const result = await g_app.api.pages.visit({url});
		if (!result || result.isErr()) {
			console.log(result);
			return {
				isNotFound: true,
			};
		}

		const data = result.getData();
		const page = data.page;
		const content = page.content || "";
		store.commit("setData", {
			"__currentUrl__": url,
			"__currentContent__": content,
		});

		return {
			page: page,
			content: content,
			url,
		};
	},

	methods: {
		async visitPage() {
			//await this.api.pages.visitByKey({key: this.key});
		}

	},

	created() {
		//console.log(this.content);
	},

	async mounted() {
		//const url = window.location.href;
		//const key = await getKey(key);
		//const result = await api.pages.get({key:key});
		//if (!result || result.isErr()) {
			//console.log(result);
			//return;
		//}
		//const page = result.getData();

		//this.key = key;
		//this.content = page.content || "";

		this.visitPage();

		this.setData("__currentUrl__", this.url);
		this.setData("__currentContent__", this.content);
	}
}
</script>
