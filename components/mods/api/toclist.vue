
<template>
	<div class="apis-toclist-container container">
		<div class="search-container">
			<el-select v-model="title" @change="handleSelectChange" size="small" clearableallow-create filterable default-first-option>
				<el-option v-for="(x, i) in apis" :key="i" :label="x.title" :value="x.title"></el-option>
			</el-select>
		</div>
		<div v-for="(x,i) in apis" :key="i" class="api-container">
			<a :href="'#' + x.title" class="title" data-toggle="tooltip" :title="x.title">{{x.title}}</a>
		</div>
	</div>
</template>

<script>
import _ from "lodash";

import common from "./common.js";

export default {
	mixins:[common],

	data: function() {
		return {
			title:"",
			apis:[],
			head: {
				title:"API列表",
			},

		}
	},

	props: {
	},

	computed: {
	},

	watch: {
	},

	methods: {
		handleSelectChange(title) {
			window.location.hash = title;
		}
	},

	async mounted() {
		await this.loadDatas();
	},
}
</script>

<style>
</style>

<style lang="less" scoped>
.apis-toclist-container {
	.el-select {
		width: 100%;
	}
}
.search-container {
	margin-bottom:10px;
}
.title {
	display: block;
	width: 100%;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}
</style>
