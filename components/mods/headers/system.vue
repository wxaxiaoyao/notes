<template>
	<div class="headers-container">
		<div class="container full-height flex-col">
			<div class="flex-row">
				<div>
					<a class="header-icon iconfont icon-home" href="/" data-toggle="tooltip" title="首页"></a>
				</div>
				<div v-show="isAuthenticated" class="feature-container">
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
					<userlinks __style__="index"></userlinks>
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
				label:"便条",
				url:"/note/notes",
			},
			{
				label:"便条录入",
				url:"/note/notes/upsert",
			},
			{
				label:"文档",
				url:"/note/documents",
			},
			{
				label:"文档编辑",
				url:"/note/documents/editor",
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
				label:"需求",
				url:"/note/demands",
			},
			{
				label:"需求录入",
				url:"/note/demands/upsert",
			},
			{
				label:"API录入",
				url:"/note/apis/upsert",
			},
			{
				label:"API配置",
				url:"/note/apis/config",
			},
			{
				label:"API列表",
				url:"/note/apis",
			},
			{
				label:"问题",
				url:"/note/questions",
			},
			{
				label:"问题录入",
				url:"/note/questions/upsert",
			},
			{
				label:"TODO[待办事项]",
				url:"/note/todos",
			},
			{
				label:"TODO[待办事项]录入",
				url:"/note/todos/upsert",
			},
			{
				label:"项目",
				url:"/note/projects",
			},
			{
				label:"项目录入",
				url:"/note/projects/upsert",
			},
			{
				label:"BUG",
				url:"/note/bugs",
			},
			{
				label:"BUG录入",
				url:"/note/bugs/upsert",
			},
			{
				label:"消息",
				url:"/note/messages",
			},
			{
				label:"标签",
				url:"/note/tags",
			},
			{
				label:"设置",
				url:"/note/users/setting",
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
	},

	mounted() {
		if (this.authUsername) {
			this.features.splice(1, 0, {
				label:"个人主页",
				url:"/" + this.authUsername,
			});
		}
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
