<template>
	<div class="container">
		<el-row>
			<el-col :span="6" :xs="{span:24}">
				<users __style__="system" :__default_data__="userData"></users>
			</el-col>
			<el-col :span="18" :xs="{span:24}">
				<div class="rightContainer">
					<el-tabs v-model="activeItem">
						<el-tab-pane label="概述" name="overview">
							<charts __style__="calendar" :__default_data__="calendarData"></charts>
						</el-tab-pane>
						<el-tab-pane label="站点" name="site">
							<sites __style__="list" :__default_data__="sitesListData"></sites>
						</el-tab-pane>
						<el-tab-pane label="收藏" name="favorite">
							<favorites __style__="sites" :__default_data__="siteFavoriteData"></favorites>
						</el-tab-pane>
						<el-tab-pane label="粉丝" name="follows">
							<favorites __style__="fans" :__default_data__="fansData"></favorites>
						</el-tab-pane>
						<el-tab-pane label="关注" name="following">
							<favorites __style__="users" :__default_data__="followsData"></favorites>
						</el-tab-pane>
					</el-tabs>
				</div>
			</el-col>
		</el-row>
	</div>
</template>

<script>
import _ from "lodash";
import mod from "@/components/mods/common/mod.js";

export default {
	mixins: [mod],

	data: function() {
		return {
			head: {
				title:"用户主页",
			},
			activeItem: "overview",
			sitesListData:{userId:null},
			// 粉丝数据
			fansData: {objectType: 0, objectId:null},
			// 关注数据
			followsData: {objectType: 0, objectId:null},
			// 站点收藏数据
			siteFavoriteData: {objectType: 1, objectId: null, username:""},
			calendarData: {max:10, year: (new Date()).getFullYear(), data: {}},
			userData: {userinfo:{}},
			userinfo:{},
		}
	},

	computed: {
	},

	watch: {
	},

	methods: {
	},

	async mounted() {
		// 获取访问用户信息
		const username = this.__data__.username;
		if (!username) return;

		const result = await this.api.users.detail({username});
		if (result.isErr()) return 	this.pushName("notfound");
		const userinfo = result.data;
		this.setData("__current_userinfo__", this.userinfo);
		this.userinfo = userinfo;
		this.sitesListData.userId = this.userinfo.id;
		this.sitesListData.username = this.userinfo.username;
		this.fansData.objectId = this.userinfo.id;
		this.followsData.objectId = this.userinfo.id;
		this.siteFavoriteData.objectId = this.userinfo.id;
		this.siteFavoriteData.username = this.userinfo.username;
		this.calendarData.data = this.userinfo.contribution;
		this.userData.userinfo = userinfo;
	}
}
</script>

<style scoped>
.rightContainer {
	margin:10px;
}
.sitename {
	font-size:14px;
}
</style>
