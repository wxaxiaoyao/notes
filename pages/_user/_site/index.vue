<template>
	<div>
		<dialogs __style__="confirm" :__default_data__="dialogsData"></dialogs>
		<div v-if="!isNotFound" class="container">
			<div>
				<div class="site-name-container">
					<div>
						<a :href="'/' + userinfo.username">{{userinfo.username}}</a>
						<span>/</span>
						<a :href="'/' + userinfo.username + '/' + siteinfo.sitename">{{siteinfo.sitename}}</a>
					</div>
					<div class="site-actions">
						<i :class="isFavorite ? 'iconfont icon-star' : 'iconfont icon-empty-star'" @click="clickFavoriteBtn">收藏</i>
						<i v-if="isSelf" class="iconfont icon-delete delete-site-btn" @click="dialogsData.visible = true"><span>删除</span></i>
					</div>
				</div>
				<div class="site-description">{{siteinfo.description}}</div>
			</div>
			
			<el-tabs v-model="activeItem">
				<el-tab-pane label="页面" name="pages">
					<pages __style__="table" :__default_data__="pagesData"></pages>
				</el-tab-pane>
				<el-tab-pane label="问题" name="issues">
					<issues __style__="list" :__default_data__="issuesData"></issues> </el-tab-pane>
				<el-tab-pane label="粉丝" name="favorite">
					<favorites __style__="fans" :__default_data__="fansData"></favorites>
				</el-tab-pane>
				<el-tab-pane v-if="isSelf" label="设置" name="settings">
					<sites __style__="setting" :__default_data__="sitesData"></sites>
				</el-tab-pane>
			</el-tabs>
		</div>
		<views __style__="notfound" v-if="isNotFound"></views>
	</div>
</template>

<script>
import _ from "lodash";
import wurl from "wurl";
import {
	Tabs,
	TabPane,
} from "element-ui";

import api from "@/api/notes.js";
import component from "@/components/component.js";

const loadDatas = async ({path}) => {
	const paths = path.split("/");
	const username = paths[1];
	const sitename = paths[2];
	let result = await api.sites.getByName({username, sitename});
	if (result.isErr()) return {isNotFound: true};

	const data = result.getData();
	return {userinfo:data.user, siteinfo:data.site};
}

export default {
	mixins: [component],

	data: function() {
		const self = this;
		return {
			objectType: 1,
			fansData: {
				objectType:1,
				objectId:undefined,
			},
			issuesData: {
				objectType:1,
				objectId:undefined,
			},
			pagesData: {
				username: "",
				sitename: "",
			},
			sitesData:{
				site:{},
			},
			dialogsData: {
				visible: false,
				title: "站点删除",
				content: "是否确定删除站点? 删除后站点里的所有页面也将被删除, 谨慎处理.",
				primary: "cancel",
				success: () => {
					self.confirmDeleteSite();
					window.location.href = "/" + self.userinfo.username;
				}
			},
			isSelf: false,
			isNotFound: false,
			isFavorite: false,
			activeItem: "pages",
			userinfo:{},
			siteinfo:{},
		}
	},

	components: {
		[Tabs.name]: Tabs,
		[TabPane.name]: TabPane,
	},

	computed: {
	},

	methods: {
		async clickFavoriteBtn() {
			if (!this.isAuthenticated) this.$message("未登录");

			const oper = this.isFavorite ? "destroy" : "create";
			const result = await this.api.favorites[oper]({
				objectId: this.siteinfo.id,
				objectType: 1,
			});

			if (result.isErr()) return this.$message(result.getMessage());

			this.isFavorite = !this.isFavorite;
		},

		async confirmDeleteSite() {
			const site = this.siteinfo;
			const result = await this.api.sites.delete({id:site.id});

			if (result.isErr()) return;

			window.href = "/" + this.userinfo.username;
		}
	},

	async asyncData({req, redirect}) {
		//if (!req) return;
		//const url = req.ctx.href;
		//const path = wurl("path", url);

		//return loadDatas({path});
	},

	async mounted() {
		const path = this.$route.path;
		const data = await loadDatas({path}) || {};
		this.isNotFound = data.isNotFound;
		this.siteinfo = data.siteinfo;
		this.userinfo = data.userinfo;
		this.isSelf = this.user.username == this.userinfo.username;
		this.fansData.objectId = this.siteinfo.id;
		this.issuesData.objectId = this.siteinfo.id;
		this.pagesData.username = this.userinfo.username;
		this.pagesData.sitename = this.siteinfo.sitename;
		this.sitesData.site = this.siteinfo;
	}
}
</script>

<style scoped>
.site-name-container {
	display: flex;
	justify-content: space-between;
	font-size:20px;
	margin:15px 0px;
}
.site-actions>i {
	margin-left:4px;
}
.delete-site-btn>span {
	color: gray;
}
</style>
