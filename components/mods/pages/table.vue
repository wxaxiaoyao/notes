
<template>
	<div class="pages-table-container">
		<el-table :data="__data__.pages">
			<el-table-column label="文件名">
				<template slot-scope="{row}">
					<div class="page-item-container" @click="clickPageItem(row)">
						<i :class="['iconfont', row.isFolder ? 'icon-folder' : 'icon-file']"></i>
						<a class="filename">{{row.filename}}</a>
					</div>
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="访问量" prop="visitorCount" width="90px">
				<template slot-scope="{row}">
					<span>{{row.visitorCount || 0}}</span>
				</template>
			</el-table-column>
			<el-table-column fixed="right" label="更新时间" width="100px">
				<template slot-scope="{row}">
					<span>{{row.updatedAt | datetime}}</span>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
import _ from "lodash";
import {
	Table,
	TableColumn,
} from "element-ui";
import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	components: {
		[Table.name]: Table,
		[TableColumn.name]: TableColumn,
	},

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
			if (!datestr) return "";

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
			if (!path) return;
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
			if (!this.__data__.username || !this.__data__.sitename) return;
			const prefix = this.__data__.username + "/" + this.__data__.sitename + "/";
			await this.getPageList(prefix);
		},
		async getPageList(prefix) {
			if (this.prefix == prefix) return;
			this.prefix = prefix;

			const res = await this.api.pages.get({folder: prefix, "x-order":"type-desc"});
			const list = res.data || [];
			_.each(list, o => {
				if(_.endsWith(o.url, "/")) o.isFolder = true;
				const urls = o.url.split("/");
				o.filename = o.isFolder ? urls[urls.length-2] : urls[urls.length-1];
			});
			if (this.prefix.split("/").length > 3) {
				list.splice(0,0, {filename:"..", isFolder: true, url: this.prefix.replace(/[^\/]*\/$/, "")});
			}
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

<style lang="scss">
.pages-table-container {
	.el-table th {
		padding: 0px 0px;
	}
	.el-table td {
		padding: 0px;
	}
}
</style>

<style scoped>
.container {
}

.page-list-header-container {
	padding:10px;
}

.page-item-container {
}

.page-item-container  a:hover {
	text-decoration: underline;
	cursor: pointer;
}

.filename {
	margin-left:2px;
}
</style>
