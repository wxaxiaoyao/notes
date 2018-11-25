
<template>
	<div class="experiences-index-container container">
		<dialogs __style__="confirm" :__default_data__="dialogsConfirmData"></dialogs>

		<div class="inputs-container">
			<inputs __style__="query" :__default_data__="inputsQueryData"></inputs>
			<div><el-button @click="clickNewBtn" size="mini">新增</el-button></div>
		</div>

		<el-table :data="list" :default-sort="{prop:'tags', order:'ascending'}" size="mini">
			<el-table-column type="expand">
				<template slot-scope="{row}">
					<div v-html="row.text"></div>
				</template>
			</el-table-column>
			<el-table-column prop="title" label="标题" width="400" sortable>
			</el-table-column>
			<el-table-column prop="updatedAt" label="更新时间">
				<template slot-scope="{row}">
					{{ row.updatedAt | datetime }}
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
import moment from "moment";
import common from "./common.js";

moment.locale("zh-cn");

export default {
	mixins:[common],

	data: function() {
		return {
			head: {
				title:"感悟",
			}
		}
	},

	props: {
	},

	computed: {
	},

	filters: {
		datetime(datestr) {
			return moment(datestr).fromNow();
		}
	},

	async mounted() {
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
