<template>
	<div class="container">
		<div class="title">
			<h2>新建站点</h2>
		</div>
		<div class="content">
			<el-form ref="form" :model="site" label-width="80px">
				<el-form-item label="名称">
					<el-input v-model="site.sitename" placeholder="名称"></el-input>
				</el-form-item>

				<el-form-item label="描述">
					<el-input v-model="site.description" placeholder="描述"></el-input>
				</el-form-item>

				<el-form-item label="公开">
					<el-switch v-model="site.public">
					</el-switch>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="clickSubmitSiteBtn">提交</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
import mod from "@/components/mods/common/mod.vue";

export default {
	mixins: [mod],

	data: function() {
		return {
			head: {
				title:"站点-创建",
			},

			site: {},
		}
	},

	methods: {
		async clickSubmitSiteBtn() {
			const result = await this.api.sites.create(this.site);
			if (result.isErr()) {
				return Message(result.getMessage());
			}

			this.$router.push({path: "/" + this.user.username + "/" + this.site.sitename});
		}
	},
}
</script>

<style scoped>
.title {
	border-bottom: 1px solid #e1e4e8;
}
.content {
	margin-top:20px;
}
</style>

