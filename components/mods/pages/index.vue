
<template>
	<div class="container">
		<div class="page-item-container page-list-header-container">
			<breadcrumbs :__default_data__="navsData"></breadcrumbs>
		</div>
		<div class="page-item-container" v-for="(x, i) in __data__.pages" :key="i">
			<div>
				<i :class="['iconfont', x.isFolder ? 'icon-folder' : 'icon-file']"></i>
				<a @click="clickPageItem(x)">{{x.filename}}</a>
			</div>
			<div>
				<span>{{x.updatedAt | datetime}}</span>
			</div>
		</div>
	</div>
</template>

<script>
import _ from "lodash";
import common from "./common.js";
export default {
	mixins:[common],

	data: function() {
		return {
			navsData:{path:""},
			prefix:"",
		}
	},

	props: {
		__default_data__: {
			type: Object,
			default: function() {
				return {
					pages:[],
					username: "xiaoyao",
					sitename: "xiaoyao",
				}
			}
		}
	},

	filters: {
		datetime(datestr) {
			const dateTime = new Date(datestr).getTime();
			const curTime = new Date().getTime();
			const count = curTime - dateTime;
			const secordTime = 1000;
			const minuteTime = secordTime * 60;
			const hourTime = minuteTime * 60;
			const dayTime = hourTime * 24;
			const monthTime = dateTime * 30;
			const yearTime = monthTime * 12; 
			const times=[yearTime, monthTime, dayTime, hourTime, minuteTime, secordTime];
			const timestrs=["年", "月", "天", "小时", "分钟", "秒"];
			for (let i = 0; i < times.length; i++) {
				const index = Math.floor(count / times[i]);
				if (index > 0) {
					return index + timestrs[i] + "前";
				}
			}

			return "刚刚";
		}
	},

	watch: {
		"navsData.path": function(path) {
			this.getPageList(this.__data__.username + "/" + path + "/");
		},
		"__data__.username": function() {
			this.parseData();
		},
		"__data__.sitename": function() {
			this.parseData();
		},
	},

	methods:{
		async parseData() {
			const prefix = this.__data__.username + "/" + this.__data__.sitename + "/";
			await this.getPageList(prefix);
		},
		async getPageList(prefix) {
			if (this.prefix == prefix) return;
			this.prefix = prefix;

			const res = await this.api.pages.get({folder: prefix});
			const list = res.data || [];
			_.each(list, o => {
				if(_.endsWith(o.url, "/")) o.isFolder = true;
				const urls = o.url.split("/");
				o.filename = o.isFolder ? urls[urls.length-2] : urls[urls.length-1];
			});
			this.$set(this.__data__, "pages", list);

			this.navsData.path = prefix.replace(this.__data__.username + "/", "").replace(/\/$/, "");
		},

		async clickPageItem(page) {
			if (page.isFolder) {
				return await this.getPageList(page.url);
			}
			window.open(window.location.origin + "/" + page.url.replace(/\/$/, ""));
		},
	},

	async mounted() {
		await this.parseData();
	},
}
</script>

<style scoped>
.container {
}

.page-list-header-container {
	border-top:3px solid gray !important;
}

.page-item-container {
	display: flex;
	justify-content: space-between;
	border: 1px solid gray;
	border-top: none;
	padding: 4px 10px;
}

.page-item-container  a:hover {
	text-decoration: underline;
	cursor: pointer;
}
</style>
