
<template>
	<div class="container">
		<dialogs __style__="confirm" :__default_data__="dialogsConfirmData"></dialogs>
		<el-table :data="list">
			<el-table-column label="URL" prop="url">
			</el-table-column>
			<el-table-column label="更新时间" prop="updatedAt">
				<template slot-scope="{row}">
					{{row.updatedAt | datetime}}
				</template>
			</el-table-column>
			<el-table-column label="操作" fixed="right" width="80px">
				<template slot-scope="{row, $index}">
					<i @click="clickEditBtn(row)" class="oper-icon el-icon-edit" data-toggle="tooltip" title="编辑"></i>
					<i @click="clickDeleteBtn(row, $index)" class="oper-icon el-icon-delete" data-toggle="tooltip" title="移除"></i>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
import _ from "lodash";
import common from "./common.js";

export default {
	mixins:[common],

	data: function() {
		return {
			dialogsConfirmData: {},
			list:[],
		}
	},

	props: {
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
		clickEditBtn(data) {
			window.open("/note/editors/simple#" + data.url);
		},
		async clickDeleteBtn(x, index) {
			this.dialogsConfirmData = {
				visible: true,
				title:"删除确认",
				content:"确定要删除此条记录?",
				success: async () => {
					const result = await this.api.pages.delete({id:x.id});
					if (result.isErr()) return this.$message({message:"删除失败"});
					this.list.splice(index, 1);
				}
			};
		},
		async getPageList() {
			const res = await this.api.pages.get({"x-order":"updatedAt-desc"});
			const list = res.data || [];
			const pages = [];
			_.each(list, o => {
				if(_.endsWith(o.url, "/")) return ;
				pages.push(o);
			});
			this.list = pages;
		},
	},

	async mounted() {
		await this.getPageList();
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
