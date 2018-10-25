
<template>
	<div class="suggestions-index-container container">
		<el-table :data="suggestions">
			<el-table-column prop="username" label="姓名" width="100px">
			</el-table-column>
			<el-table-column prop="email" label="邮箱" width="180px">
			</el-table-column>
			<el-table-column prop="description" label="内容">
			</el-table-column>
			<el-table-column prop="createdAt" label="创建时间">
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
			suggestions:[],
		}
	},

	props: {
	},

	computed: {
	},

	async mounted() {
		const result = await this.api.suggestions.get();
		const suggestions = result.data || [];

		_.each(suggestions, o => {
			o.createdAt = o.createdAt.replace("T", " ").replace(".000Z", "");
		});

		this.suggestions = suggestions;
	}
}
</script>

<style>
</style>

<style scoped>
.suggestions-index-container {

}
</style>
