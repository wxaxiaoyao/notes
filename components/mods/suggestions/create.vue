
<template>
	<div class="suggestions-create-container container">
		<div class="title-container">意见反馈</div>
		<el-form ref="form" :model="suggestion" label-width="80px">
			<el-form-item label="姓名">
				<el-input v-model="suggestion.username" placeholder="请输入你的称呼"></el-input>
			</el-form-item>
			<el-form-item label="邮箱">
				<el-input v-model="suggestion.email" placeholder="请留下您邮箱地址以便进一步的沟通相关内容"></el-input>
			</el-form-item>
			<el-form-item label="描述">
				<el-input v-model="suggestion.description" type="textarea" :autosize="{minRows:4, maxRows:10}"
					placeholder="请详细描述下你反馈的内容,我们核实后会尽快修复和改进 ^-^">
				</el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="clickSubmitSuggestionBtn">提交</el-button>
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
			suggestion: {
			},

			head: {
				title:"意见反馈",
			}
		}
	},

	props: {
	},

	computed: {
	},

	methods: {
		async clickSubmitSuggestionBtn() {
			if (!this.suggestion.email || !this.suggestion.description) {
				return this.$message({message:"联系方式和反馈内容不能为空"});
			}

			const result = await this.api.suggestions.create(this.suggestion);
			if (result.isErr()) return this.$message({message:"意见反馈提交失败, 请稍后重试!!!"});

			this.$message({
				message:"意见反馈提交成功, 祝你身体健康,工作顺利, 即将跳转至意见箱页面^-^",
				onClose: () => {
					this.$router.push("/note/suggestions");
				}
			});
		},
	},

}
</script>

<style>
</style>

<style scoped>
.suggestions-create-container {
}

.title-container {
	font-weight:bold;
	font-size:30px;
	text-align:center;
	margin: 20px auto;
}
</style>
