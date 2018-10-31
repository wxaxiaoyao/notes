
<template>
	<div class="apis-doc-container container">
		<div class="api-nav-container">
			<apis __style__="toclist"></apis>
		</div>
		<div v-for="(x,i) in apis" :key="i" class="api-container">
			<apis __style__="show" :__default_data__="x"></apis>
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
		}
	},

	props: {
	},

	computed: {
	},

	methods: {
	},

	async mounted() {
		await this.loadDatas();
	},
}
</script>

<style>
</style>

<style lang="less" scoped>
.apis-doc-container {
}
.api-nav-container {
	z-index:1;
	position: fixed;
	width: 300px;
	right: 20px;
	top: 100px;
}
.api-container {
	padding-top:15px;
}
.header-container {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 15px 40px 0px 10px;

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
</style>
