
<template>
	<div class="inputs-query-container">
		<el-dropdown @command="clickNewBtn" placement="bottom">
			<i class="iconfont icon-filter" data-toggle="tooltip" title="过滤"></i>
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item v-for="(x, i) in __data__.fields" :key="i" :command="i">{{x.label}}</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
		<el-form :inline="true" size="mini">
			<el-form-item v-for="(x, i) in __data__.values" :key="i" :label="__data__.fields[x.key].label">
				<div style="display:flex">
					<el-input v-if="__data__.fields[x.key].type == 'input'" v-model="x.value" :placeholder="__data__.fields[x.key].description || ''" clearable></el-input>
					<el-select v-if="__data__.fields[x.key].type == 'select'" v-model="x.value" :placeholder="__data__.fields[x.key].description || ''">
						<el-option v-for="(o, i) in __data__.fields[x.key].options || []" :key="i" :label="o.label" :value="o.value"></el-option>
					</el-select>
					<el-button @click="clickDeleteBtn(i)" icon="iconfont icon-minus" circle></el-button>
				</div>
			</el-form-item>
			<el-form-item v-show="__data__.values.length">
				<el-button @click="clickQueryBtn">查询</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
					//<el-button>过滤<i class="el-icon-arrow-down el-icon--right"></i></el-button>
import _ from "lodash";

import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	data: function() {
		return {
			default_data: {
				values:[
				{key:"title", value:""},
				{key:"projectId", value:""},
				],
				fields: {
					title: {
						label:"标题",
						type: "input",
						description:"",
					},
					projectId: {
						label:"项目",
						type:"select",
						description:"请选择项目",
						options: [
						{label:"keepwork", value:1},
						{label:"note", value:2},
						],
					}
				},
			}
		}
	},

	methods:{
		clickDeleteBtn(index) {
			this.__data__.values.splice(index,1);
		},

		clickNewBtn(key) {
			const index = _.findIndex(this.__data__.values, o => o.key == key);
			if (index >= 0) return;

			const field = this.__data__.fields[key];
			this.__data__.values.push({
				key,
				value: field.value || "",
			});
		},

		clickQueryBtn() {
			this.__data__.queryCB && this.__data__.queryCB(this.__data__);
		}
	},

	mounted() {
	}
}
</script>

<style lang="less">
.inputs-query-container {
	display:flex;
	align-items: center;
	
	.el-dropdown {
		margin-right: 5px;
	}

	.el-form-item {
		margin-bottom: 0px;
	}
}
</style>
