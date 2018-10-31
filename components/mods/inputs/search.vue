
<template>
	<div class="inputs-search-container">
		<el-input v-model="value" clearable placeholder="请输入搜索内容" class="input-with-select" suffix-icon="el-icon-search" size="small">
			<el-select v-if="field" v-model="field" slot="prepend">
				<el-option v-for="(x, i) in data.fields" :key="i" :label="x.label" :value="x.value"></el-option>
			</el-select>
		</el-input>
	</div>
</template>

<script>
import _ from "lodash";

import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	data: function() {
		return {
			value:"",
			field:"",
			data: {
				fields:[
				{label:"标题", value:"title"},
				{label:"标题1", value:"titlei1"},
				],
			}
		}
	},

	watch: {
		value: function(str) {
			this.__data__.change && this.__data__.change(str, this.field);
		},
	},

	methods:{
	},

	mounted() {
		_.each(this.__data__, (val, key) => this.data[key] = this.__data__[key]);
		this.field = this.data.field || (this.data.fields && this.data.fields.length ? this.data.fields[0].value : "");
	}
}
</script>

<style lang="less" scoped>
.inputs-search-container {
	.input-with-select {
		width:400px;
		.el-select {
			width:100px;
		}
	}
}
</style>
