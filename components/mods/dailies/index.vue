
<template>
	<div class="dailies-index-container container">
		<div class="header-container">
			<div class="title">日报</div>
			<inputs __style__="search" :__default_data__="inputsSearchData"></inputs>
			<el-button @click="clickNewBtn" type="text" round>新增</el-button>
		</div>
		<el-table :data="list">
			<el-table-column prop="date" label="日期" width="100px">
			</el-table-column>
			<el-table-column prop="content" label="内容">
			</el-table-column>
			<el-table-column prop="tags" label="标签" fixed="right" width="150">
				<template slot-scope="{row}">
					<tags __style__="show" :__default_data__="row.tagsData"></tags>
				</template>
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

import common from "./common.js";

export default {
	mixins:[common],

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

	methods: {
	},

	async mounted() {
		await this.loadDatas();
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
