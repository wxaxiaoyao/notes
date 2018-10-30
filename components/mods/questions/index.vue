

<template>
	<div class="questions-index-container container">
		<div class="header-container">
			<div class="title">问题管理</div>
			<el-input v-model="searchValue" clearable placeholder="请输入搜索内容" class="input-with-select" size="small">
				<el-select v-model="searchField" slot="prepend" @change="handleSelectField">
					<el-option v-for="(x, i) in fields" :key="i" :label="x.label" :value="x.value"></el-option>
				</el-select>
			</el-input>
			<el-button @click="clickNewBtn" type="text" round>新增</el-button>
		</div>
		<el-table :data="list" :default-sort="{prop:'tags', order:'ascending'}" cell-class-name="cell-container">
			<el-table-column type="expand">
				<template slot-scope="{row}">
					<questions __style__="show" :__default_data__="row | dataFilters"></questions>
				</template>
			</el-table-column>
			<el-table-column prop="title" label="链接" width="300" sortable>
			</el-table-column>
			<el-table-column prop="tags" label="标签" width="200" :filters="filterTags" :filter-method="filterTagMethod" sortable>
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
import common from "./common.js";

export default {
	mixins:[common],

	async mounted() {
		await this.loadDatas();
	}
}
</script>

<style lang="less">
.questions-index-container {
	.cell-container {
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
