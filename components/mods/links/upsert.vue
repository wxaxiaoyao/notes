
<template>
	<div class="links-create-container container">
		<div class="header-container">
			<div class="title">链接录入</div>
			<el-button @click="clickListBtn" type="text" round>列表<i class="iconfont icon-list"></i></el-button>
		</div>
		<el-form ref="form" :model="link" label-width="80px">
			<el-form-item label="标题">
				<el-input v-model="link.title" placeholder="链接标题"></el-input>
			</el-form-item>
			<el-form-item label="地址">
				<el-input v-model="link.href" placeholder="链接地址"></el-input>
			</el-form-item>
			<el-form-item label="备注">
				<el-input v-model="link.description" type="textarea" :autosize="{minRows:2, maxRows:4}"
					placeholder="链接内容备注 ^-^">
				</el-input>
			</el-form-item>
			<el-form-item>
				<el-button @click="clickSubmitLinkBtn">提交</el-button>
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
			link: {},

			head: {
				title:"链接录入",
			}
		}
	},

	props: {
	},

	computed: {
	},

	methods: {
		clickListBtn() {
			this.$router.push({path:"/note/links"});
		},

		async clickSubmitLinkBtn() {
			if (!this.link.href) return this.$message({message:"链接地址不能为空"});

			const result = await this.api.links.upsert(this.link);
			if (result.isErr()) return this.$message({message:"提交失败, 请稍后重试!!!"});

			this.$router.push("/note/links");
		},
	},

	async mounted() {
		if (this.__data__.id) {
			const result = await this.api.links.getById({id:this.__data__.id});
			this.link = result.data || {};
		}
	},
}
</script>

<style>
</style>

<style lang="less" scoped>
.links-create-container {
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
