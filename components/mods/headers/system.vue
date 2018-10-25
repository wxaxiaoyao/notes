<template>
	<div class="headers-container">
		<div class="container full-height flex-col">
			<div class="flex-row">
				<div>
					<a class="header-icon iconfont icon-home" href="/" data-toggle="tooltip" title="首页"></a>
					<!--a v-if="isAuthenticated" class="header-icon iconfont icon-edit" href="/note/editors/simple" data-toggle="tooltip" title="简易编辑器"></a-->
				</div>
				<div class="feature-container">
					<el-select v-model="url"
						@change="handleSelect"
						size="small"
						clearable
						filterable 
						default-first-option
						placeholder="功能名称">
						<el-option v-for="(x, i) in features" :key="i" :label="x.label" :value="x.url">
							<span style="float:left">{{x.label}}</span>
							<span style="float:right; color:#8492a6; font-size:13px">{{x.url}}</span>
						</el-option>
					</el-select>
				</div>
				<div>
					<userlinks __style__="system"></userlinks>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import common from "./common.js";
export default {
	mixins: [common],

	components: {
	},

	data: function() {
		return {
			url:"",
			features: [
			{
				label:"首页",
				url:"/",
			},
			{
				label:"简易编辑器",
				url:"/note/editors/simple",
			},
			{
				label:"编辑器",
				url:"/note/editors",
			},
			{
				label:"链接",
				url:"/note/links",
			},
			{
				label:"链接录入",
				url:"/note/links/upsert",
			},
			{
				label:"日报",
				url:"/note/dailies",
			},
			{
				label:"日报录入",
				url:"/note/dailies/upsert",
			},
			{
				label:"团队",
				url:"/note/teams",
			},
			{
				label:"团队组建",
				url:"/note/teams/create",
			},
			{
				label:"站点",
				url:"/note/sites",
			},
			{
				label:"新增站点",
				url:"/note/sites/create",
			},
			{
				label:"意见反馈",
				url:"/note/suggestions",
			},
			{
				label:"意见反馈录入",
				url:"/note/suggestions/create",
			},
			{
				label:"任务",
				url:"/note/tasks",
			},
			{
				label:"新建任务",
				url:"/note/tasks/new",
			},
			{
				label:"草稿页",
				url:"/note/editors/draft",
			},
			]
		}
	},

	methods: {
		handleSelect() {
			this.$router.push({path: this.url});
		}
	},

	created() {
		if (this.authUsername) {
			this.features.splice(1, 0, {
				label:"个人主页",
				url:"/" + this.authUsername,
			});
		}
	},

	mounted() {
	}
}
</script>

<style lang="less" scoped>
@media screen and (max-width: 768px) {
	.el-select {
		width:200px;
	}
}

@media screen and (min-width: 768px) {
	.el-select {
		width:400px;
	}
}
.headers-container {
	border-bottom: 1px solid rgb(221,221,221);
	height:60px;
}
.flex-col {
	display: flex;
	flex-direction: column;
	justify-content: center;
}
.flex-row {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-right: 10px;
}
.header-icon {
	font-size:30px;
	text-decoration: none;
}
</style>
