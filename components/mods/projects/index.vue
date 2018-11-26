
<template>
	<div class="projects-index-container container">
		<dialogs __style__="confirm" :__default_data__="dialogsConfirmData"></dialogs>
		<el-table :data="list" size="mini">
			<el-table-column prop="name" label="标题" width="400" sortable>
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
</style>

<style lang="less" scoped>
.projects-index-container {

}
</style>
