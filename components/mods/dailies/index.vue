
<template>
	<div class="dailies-index-container container">
		<div class="header-container">
			<div class="title">日报</div>
			<el-input v-model="searchValue" clearable placeholder="请输入搜索内容" class="input-with-select" size="small">
				<el-select v-model="searchField" slot="prepend">
					<el-option v-for="(x, i) in fields" :key="i" :label="x.label" :value="x.value"></el-option>
				</el-select>
			</el-input>
			<el-button @click="clickNewBtn" type="text" round>新增</el-button>
		</div>
		<el-table :data="dailies">
			<el-table-column prop="date" label="日期" width="100px">
			</el-table-column>
			<el-table-column prop="content" label="内容">
			</el-table-column>
			<el-table-column prop="tags" label="标签" fixed="right" width="150px">
			</el-table-column>
			<el-table-column label="操作" fixed="right" width="100px">
				<template slot-scope="{row, $index}">
					<i @click="clickEditBtn(row)" class="oper-icon el-icon-edit" data-toggle="tooltip" title="编辑"></i>
					<!--i disabled @click="clickDeleteBtn(row, $index)" class="oper-icon el-icon-delete"></i-->
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
import _ from "lodash";

import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	data: function() {
		return {
			searchValue:"",
			searchField:"content",
			fields: [
			{label:"日期", value:"date"},
			{label:"标签", value:"tags"},
			{label:"内容", value:"content"},
			],

			dailies:[],

			head: {
				title:"日报",
			}
		}
	},

	filters: {
	},

	watch: {
		searchValue(str) {
			this.handleSearchChange(str);
		}
	},

	methods: {
		handleSearchChange(str) {
			this.dailies = [];
			_.each(this.list, x => {
				const value = x[this.searchField];
				if (g_app.util.lcs(value, str) == str.length) {
					this.dailies.push(x);
				}
			});
		},

		async clickDeleteBtn(x, index) {
			//const reuslt = await this.api.dailies.delete({id:x.id});
			//if (result.isErr()) return this.$message({message:"删除失败"});
			this.dailies.splice(index, 1);
		},

		async clickEditBtn(x) {
			this.$router.push({path:"/note/dailies/upsert?id=" + x.id});
		},

		clickNewBtn() {
			this.push("/note/dailies/upsert");
		}
	},

	async mounted() {
		const result = await this.api.dailies.get({"x-order":"date-desc"});
		const dailies = result.data || [];
		_.each(dailies, daily => {
			daily.tags = daily.tags.split("|").filter(o => o).join(" ");
		});
		this.dailies = dailies;
		this.list = dailies;
	}
}
</script>

<style lang="less" scoped>
.dailies-index-container {
	
}
.header-container {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-top: 15px;

	.input-with-select {
		width:400px;
		.el-select {
			width:100px;
		}
	}

	.title {
		font-weight: bold;
		font-size:20px;
	}
}
.task-container {
	display: flex;
}
.oper-icon {
	margin:2px;
}
</style>
