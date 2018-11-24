
<template>
	<div class="bugs-index-container container">
		<dialogs __style__="confirm" :__default_data__="dialogsConfirmData"></dialogs>

		<div class="inputs-container">
			<inputs __style__="query" :__default_data__="inputsQueryData"></inputs>
			<div><el-button @click="clickNewBtn" size="mini">新增</el-button></div>
		</div>

		<el-table :data="list" :default-sort="{prop:'tags', order:'ascending'}" size="mini">
			<el-table-column type="expand">
				<template slot-scope="{row}">
					<modules __style__="render" :__default_data__="{text: row.description}" ></modules>
				</template>
			</el-table-column>
			<el-table-column prop="title" label="标题" width="400" sortable>
			</el-table-column>
			<el-table-column prop="projectstr" label="项目">
			</el-table-column>
			<el-table-column prop="statestr" label="状态">
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
		//<div class="query-container">
			//<el-input placeholder="请输入检索内容" v-for="(x, i) in fields" :key="i" v-model="x.value">
				//<el-select v-model="x.key">
					//<el-option label="标题" value="title"></el-option>
					//<el-option label="项目" value="title"></el-option>
				//</el-select>
			//</el-input>
		//</div>

import _ from "lodash";

import common from "./common.js";

export default {
	mixins:[common],

	data: function() {
		return {
			head: {
				title:"BUG",
			}
		}
	},

	props: {
	},

	computed: {
	},

	async mounted() {
		await this.loadProjects();
		await this.loadDatas();
	},
}
</script>

<style lang="less">
</style>

<style lang="less" scoped>
.bugs-index-container {

}
.inputs-container {
	margin-top:20px;
	display: flex;
	justify-content: space-between;
}
</style>
