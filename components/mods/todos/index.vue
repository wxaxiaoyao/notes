
<template>
	<div class="todos-index-container container">
		<div class="header-container">
			<div class="title">待办事项</div>
			<el-input v-model="searchValue" clearable placeholder="请输入搜索内容" class="input-with-select" size="small">
				<el-select v-model="searchField" slot="prepend" @change="handleSelectField">
					<el-option v-for="(x, i) in fields" :key="i" :label="x.label" :value="x.value"></el-option>
				</el-select>
			</el-input>
			<el-button @click="clickNewBtn" type="text" round>新增</el-button>
		</div>
		<el-table :data="list" :default-sort="{prop:'tags', order:'ascending'}">
			<el-table-column prop="title" label="链接" width="200" sortable>
			</el-table-column>
			<el-table-column prop="ratestr" label="重要性" width="80">
			</el-table-column>
			<el-table-column prop="statestr" label="状态" width="80">
			</el-table-column>
			<el-table-column prop="tags" label="标签" width="120" :filters="filterTags" :filter-method="filterTagMethod" sortable>
				<template slot-scope="{row}">
					<tags __style__="show" :__default_data__="row.tagsData"></tags>
				</template>
			</el-table-column>
			<el-table-column prop="description" label="备注">
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

		}
	},

	props: {
	},

	computed: {
	},

	async mounted() {
		await this.loadDatas();
	},
}
</script>

<style lang="less">
.todos-index-container {
	.cell {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
}
</style>

<style lang="less" scoped>
.title-container {
	font-weight:bold;
}
.description-label, .answer-label {
	font-weight: bold;
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
.oper-icon {
	margin:2px;
}
</style>
