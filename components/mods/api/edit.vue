

<template>
	<div class="apis-edit-container container">
		<el-tabs>
			<el-tab-pane label="API">
				<apis __style__="upsert" :__default_data__="__data__"></apis>
			</el-tab-pane>
			<el-tab-pane label="测试">
				<apis __style__="request" :__default_data__="__data__"></apis>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
import _ from "lodash";

import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	data: function() {
		return {
			defaultData: {
			}
		}
	},

	props: {
	},

	computed: {
	},

	mounted() {

	},
}
</script>

<style lang="less">
</style>

<style lang="less" scoped>
</style>
