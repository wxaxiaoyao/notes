
<template>
	<div class="demands-upsert-container container">
		<div class="header-container">
			<div class="title">需求录入</div>
			<div>
				<el-button type="primary" @click="clickSubmitBtn">保存</el-button>
				<el-button @click="clickListBtn" type="text">列表</el-button>
			</div>
		</div>
		<el-tabs v-model="activeName">
			<el-tab-pane label="基本信息" name="baseinfo">
				<el-form label-width="80px">
					<el-form-item label="标题">
						<el-input v-model="demand.title" placeholder="请输入需求标题..."></el-input>
					</el-form-item>
					<el-form-item label="标签">
						<tags :__default_data__="tagsData"></tags>
					</el-form-item>
					<el-form-item label="类型">
						<el-select style="width:100%;" v-model="demand.type" placeholder="请选择需求类型">
							<el-option v-for="x in demandTypes" :key="x.value" :label="x.label" :value="x.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="简述">
						<el-input v-model="demand.description" type="textarea" :autosize="{minRows:2, maxRows:5}" placeholder="需求简述 ^-^"></el-input>
					</el-form-item>
				</el-form>
			</el-tab-pane>
			<el-tab-pane label="需求故事" name="story">
				<editors v-if="activeName == 'story'" class="editor" __style__="codemirror" :__default_data__="storyData"></editors>
			</el-tab-pane>
			<el-tab-pane label="使用场景" name="sence">
				<editors v-if="activeName == 'sence'" class="editor" __style__="codemirror" :__default_data__="senceData"></editors>
			</el-tab-pane>
			<el-tab-pane label="目标用户" name="customer">
				<editors v-if="activeName == 'customer'" class="editor" __style__="codemirror" :__default_data__="customerData"></editors>
			</el-tab-pane>
			<el-tab-pane label="价值产出" name="worth">
				<editors v-if="activeName == 'worth'" class="editor" __style__="codemirror" :__default_data__="worthData"></editors>
			</el-tab-pane>
			<el-tab-pane label="功能特性" name="feature">
				<editors v-if="activeName == 'feature'" class="editor" __style__="codemirror" :__default_data__="featureData"></editors>
			</el-tab-pane>
			<el-tab-pane label="实现方案" name="implement">
				<editors v-if="activeName == 'implement'" class="editor" __style__="codemirror" :__default_data__="implementData"></editors>
			</el-tab-pane>
			<el-tab-pane label="资源链接" name="link">
				<editors v-if="activeName == 'link'" class="editor" __style__="codemirror" :__default_data__="linkData"></editors>
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
			activeName:"baseinfo",
			demand:{},
			demandTypes: [
			{label:"基础型", value:0},
			{label:"期望型", value:1},
			{label:"兴奋型", value:2},
			{label:"无差异型", value:3},
			{label:"反向型", value:4},
			],
			tagsData:{editable:true},
			storyData:{text:""},
			senceData:{text:""},
			customerData:{text:""},
			worthData:{text:""},
			featureData:{text:""},
			implementData:{text:""},
			linkData:{text:""},
		}
	},

	props: {
	},

	computed: {
	},

	methods: {
		async clickSubmitBtn() {
			const oper = this.demand.id ? "update" : "create";

			this.demand.story = this.storyData.text;
			this.demand.sence = this.senceData.text;
			this.demand.customer = this.customerData.text;
			this.demand.worth = this.worthData.text;
			this.demand.feature = this.featureData.text;
			this.implement = this.implementData.text;
			this.link = this.linkData.text;

			const result = await this.api.demands[oper](this.demand);
			
			if (result.isErr()) return this.$message({message:"提交需求失败"});

			this.$message({message:"保存成功"});
			//this.$router.push({path:"/note/demands"});
		},

		clickListBtn() {
			this.$router.push({path:"/note/demands"});
		},
	},

	async mounted() {
		if (this.__data__.id) {
			const result = await this.api.demands.getById({id:this.__data__.id});
			this.demand = result.data || {};
			this.storyData.text = this.demand.story || "";
			this.senceData.text = this.demand.sence || "";
			this.customerData.text = this.demand.customer || "";
			this.worthData.text = this.demand.worth || "";
			this.featureData.text = this.demand.feature || "";
			this.implementData.text = this.demand.implement || "";
			this.linkData.text = this.demand.link || "";
		}
	},
}
</script>

<style lang="less">
.demands-upsert-container {
}
</style>

<style scoped>
.editor {
	line-height: 20px;
	height:400px;
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
