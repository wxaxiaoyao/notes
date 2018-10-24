

<template>
	<div class="dailies-list-container container">
		<el-table 
			:data="dailies"
			style="width: 100%">
			<el-table-column prop="date" label="日期" width="100px">
			</el-table-column>
			<el-table-column prop="content" label="内容">
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
			dailies:[],
		}
	},

	filters: {
	},

	methods: {

	},

	async mounted() {
		const result = await this.api.dailies.get();
		this.dailies = result.data || [];
	}
}
</script>

<style scoped>

.dailies-list-container {
	
}
.task-container {
	display: flex;
}
</style>
