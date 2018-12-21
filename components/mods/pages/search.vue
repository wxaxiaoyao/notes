
<template>
	<el-select v-loading="loading" v-model="__data__.url" 
		@change="switchPage"
		size="small"
		clearable
		filterable 
		allow-create 
		default-first-option
		placeholder="页面地址 如: username/pagename">
		<el-option v-for="(page, i) in pagelist" :key="i" :value="page.url"></el-option>
	</el-select>
</template>

<script>
import _ from "lodash";
import {
	Select,
	Option,
	Switch,
} from "element-ui";
import common from "./common.js";
export default {
	mixins:[common],

	components:{
		[Select.name]: Select,
		[Option.name]: Option,
		[Switch.name]: Switch,
	},

	data: function() {
		return {
			loading:false,
		}
	},

	props: {
		__default_data__: {
			type: Object,
			default: function() {
				return {
					url:"",
				}
			}
		}
	},

	methods:{
		async switchPage() {
			if (!this.isAuthenticated) return;
			let url = this.__data__.url;
			const username = this.user.username;
			if (!_.startsWith(url, username + "/")) url = username + "/" + url;
			const urls = url.split("/").filter(o => o);
			if (urls.length < 3 || _.endsWith(url, "/")) url = "";
			else url = urls.join("/");

			this.loading = true;
			await this.clickSelectPage({url, finish: () => this.loading = false});
		},
	},

	async mounted() {
		await this.loadPageTrees();

		const hash = decodeURIComponent(window.location.hash || "");
		const url = hash.substring(1);
		const username = this.user.username;
		if (url.indexOf(username + "/") == 0) {
			this.__data__.url = url;
			await this.switchPage();
		}
	},
}
</script>

<style scoped>
</style>
