
<template>
	<div class="apis-config-container container">
		<div class="header-container">
			<div class="title">API配置</div>
			<div>
				<el-button @click="clickSubmitBtn" type="text">提交</el-button>
				<el-button @click="clickListBtn" type="text">API列表</el-button>
			</div>
		</div>
		<el-tabs>
			<el-tab-pane label="字段">
				<el-form ref="form" :model="data" label-width="0px" size="small">
					<el-form-item>
						<div class="item-container">
							<el-input clearable v-model="fieldKey" placeholder="字段名"></el-input>
							<el-select v-model="fieldType" placeholder="数据类型">
								<el-option v-for="(x,i) in types" :key="i" :label="x.label" :value="x.value"></el-option>
							</el-select>
							<el-input clearable v-model="fieldDescription" placeholder="备注"></el-input>
							<el-button @click="data.fields.push({key:fieldKey, type:fieldType, description:fieldDescription})">添加</el-button>
							</div>
					</el-form-item>
					<el-form-item v-for="(field, i) in data.fields" :key="'field' + i">
						<div class="item-container">
							<el-input v-model="field.key" placeholder="字段名"></el-input>
							<el-select v-model="field.type" placeholder="数据类型">
								<el-option v-for="(x,i) in types" :key="i" :label="x.label" :value="x.value"></el-option>
							</el-select>
							<el-input v-model="field.description" placeholder="备注"></el-input>
							<el-button @click="data.fields.splice(i, 1)">删除</el-button>
						</div>
					</el-form-item>
				</el-form>
			</el-tab-pane>
			<el-tab-pane label="BASE URL">
				<el-form ref="form" :model="data" label-width="0px" size="small">
					<el-form-item>
						<div class="item-container">
							<el-input v-model="baseUrl" placeholder="base URL" clearable></el-input>
							<el-input v-model="baseUrlDescription" placeholder="备注" clearable></el-input>
							<el-button @click="data.baseUrls.push({baseUrl:baseUrl, description:baseUrlDescription})">添加</el-button>
						</div>
					</el-form-item>
					<el-form-item v-for="(x, i) in data.baseUrls" :key="i">
						<div class="item-container">
							<el-input v-model="x.baseUrl" placeholder="base URL"></el-input>
							<el-input v-model="x.description" placeholder="备注"></el-input>
							<el-button @click="data.baseUrls.splice(i, 1)">删除</el-button>
						</div>
					</el-form-item>
				</el-form>
			</el-tab-pane>
			<el-tab-pane label="请求头">
				<el-form ref="form" :model="data" label-width="0px" size="small">
					<el-form-item>
						<div class="item-container">
							<el-input v-model="headerKey" placeholder="KEY" clearable></el-input>
							<el-input v-model="headerValue" placeholder="值" clearable></el-input>
							<el-input v-model="headerDescription" placeholder="备注" clearable></el-input>
							<el-button @click="data.headers.push({key:headerKey, value:headerValue, description:headerDescription})">添加</el-button>
						</div>
					</el-form-item>
					<el-form-item v-for="(header, i) in data.headers" :key="'header' + i">
						<div style="display:flex">
							<el-input v-model="header.key" placeholder="KEY"></el-input>
							<el-input v-model="header.value" placeholder="值"></el-input>
							<el-input v-model="header.description" placeholder="备注"></el-input>
							<el-button @click="data.headers.splice(i, 1)">删除</el-button>
						</div>
					</el-form-item>
				</el-form>
			</el-tab-pane>
			<el-tab-pane label="分类">
				<el-form ref="form" :model="data" label-width="0px" size="small">
					<el-form-item>
						<div class="item-container">
							<el-input v-model="classify" placeholder="分类名" clearable></el-input>
							<el-input v-model="classifyDescription" placeholder="备注" clearable></el-input>
							<el-button @click="data.classify.push({classify:classify, description:classifyDescription})">添加</el-button>
						</div>
					</el-form-item>
					<el-form-item v-for="(x, i) in data.classify" :key="'classify' + i">
						<div style="display:flex">
							<el-input v-model="x.classify" placeholder="分类名"></el-input>
							<el-input v-model="x.description" placeholder="备注"></el-input>
							<el-button @click="data.classify.splice(i, 1)">删除</el-button>
						</div>
					</el-form-item>
				</el-form>
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
			baseUrl:"",
			baseUrlDescription:"",
			headerKey:"",
			headerValue:"",
			headerDescription:"",
			fieldKey:"",
			fieldType:"string",
			fieldDescription:"",
			classify:"",
			classifyDescription:"",
			types:[
			{label:"字符串", value:'string'},
			{label:"数字", value:"number"},
			{label:"布尔", value:"boolean"},
			{label:"对象", value:"object"},
			{label:"数组", value:"array"},
			],
			data:{
				baseUrls:[],
				headers:[],
				fields:[],
				classify:[],
			},
			head: {
				title:"API配置",
			},

		}
	},

	props: {
	},

	computed: {
	},

	methods: {
		clickListBtn() {
			this.$router.push({path:"/note/apis"});
		},

		async clickSubmitBtn() {
			const result = await this.api.apis.setConfig(this.data);
			if (result.isErr())  return this.$message({message:"提交失败"});
			this.$message({message:"提交成功"});

		},	
	},

	async mounted() {
		this.data = (await this.api.apis.getConfig()).data || this.data;
		//console.log(this.data);
	},
}
</script>

<style>
</style>

<style lang="less" scoped>
.apis-config-container {

}
.item-container {
	display: flex;
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
