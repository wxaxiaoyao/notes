
<template>
	<div class="fields-upsert-container container">
		<div class="header-container">
			<div class="title">字段录入</div>
			<el-button @click="clickListBtn" type="text" round>列表<i class="iconfont icon-list"></i></el-button>
		</div>
		<el-form ref="form" :model="field" label-width="80px">
			<el-form-item label="名称">
				<el-input v-model="field.name" placeholder="字段名"></el-input>
			</el-form-item>
			<el-form-item label="类型">
				<el-select v-model="field.type">
					<el-option v-for="(x,i) in types" :key="i" :label="x.label" :value="x.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="描述">
				<el-input v-model="field.description" type="textarea" :autosize="{minRows:2, maxRows:4}"
					placeholder="链接内容备注 ^-^">
				</el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="clickSubmitFieldBtn">提交</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
import _ from "lodash";

import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],

	data: function() {
		return {
			field: {},
			types:[
			{label:"字符串", value:'string'},
			{label:"数字", value:"number"},
			{label:"布尔", value:"boolean"},
			{label:"对象", value:"object"},
			],

			head: {
				title:"字段录入",
			},
		}
	},

	props: {
	},

	computed: {
	},

	methods: {
		clickListBtn() {
			this.$router.push({path:"/note/fields"});
		},

		async clickSubmitFieldBtn() {
			const result = await this.api.fields.upsert(this.field);
			if (result.isErr()) return this.$message({message:"提交失败, 请稍后重试!!!"});

			this.$message({message:"提交成功"});
			//this.$router.push("/note/fields");
		},
	},

	async mounted() {
		if (this.__data__.id) {
			const result = await this.api.fields.getById({id:this.__data__.id});
			this.field = result.data || {};
		}
	},
}
</script>

<style>
</style>

<style lang="less" scoped>
.fields-upsert-container {
	.el-select {
		width: 100%;
	}
}

.header-container {
	display: flex;
	justify-content: space-between;
	margin-top: 15px;

	.title {
		font-weight: bold;
		font-size:20px;
	}
}
</style>
