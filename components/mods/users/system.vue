<template>
	<div class="container" v-loading="!userinfo.username">
		<img :src="userinfo.portrait || systemPortrait" class="portrait">
		<div style="width:100%">
			<h3 style="margin-top:10px; margin-bottom:0px" v-cloak>{{(userinfo.nickname || userinfo.username || "") + " " + (userinfo.username || "")}}</h3>
			<p v-if="!isEditDescription">{{userinfo.description || ""}}</p>
			<el-form v-if="isEditDescription" :model="user" style="margin-top:10px;">
				<el-form-item>
					<el-input type="textarea" v-model="user.description" placeholder="简介"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="clickSaveDescriptionBtn">保存</el-button>
					<el-button @click="isEditDescription=false">取消</el-button>
				</el-form-item>
			</el-form>
		</div>

		<el-button class="full-width" v-if="isAuthUser && !isEditDescription" @click="isEditDescription = true">编辑备注</el-button>
		<el-button class="full-width" v-if="!isAuthUser" @click="clickFollowingBtn">{{isFollowing ? "取消关注" : "关注"}}</el-button>
	</div>
</template>

<script>
import axios from "axios";
import {
	Form,
	FormItem,
} from "element-ui";
import mod from "@/components/mods/common/mod.js";

export default {
	mixins: [mod],
	components: {
		[Form.name]: Form,
		[FormItem.name]: FormItem,
	},

	data: function() {
		return {
			isEditDescription: false,
			isAuthUser:false,
			isFollowing: false,
		}
	},

	props: {
		__default_data__: {
			type: Object,
			default: function() {
				return {
					userinfo:{},
				}
			}
		}
	},

	computed: {
		userinfo: function() {
			return this.__data__.userinfo || {};
		}
	},

	watch: {
		userinfo: function() {
			this.parseData();
		},
	},

	methods: {
		async parseData() {
			if (this.userinfo && this.user) this.isAuthUser = this.userinfo.username == this.user.username;

			if (this.userinfo.id) {
				// 是否关注
				const result = await this.api.favorites.exist({objectId:this.userinfo.id, objectType:0});
				this.isFollowing = result.getData();
			}
		},

		async clickSaveDescriptionBtn() {
			const result = await this.api.users.update(this.user);
			if (result.isErr()) return this.$message(result.getMessage());
			this.setUser(this.user);
			this.userinfo.description = this.user.description;
			this.isEditDescription = false;
		},

		async clickFollowingBtn() {
			const objectId = this.userinfo.id;
			const methodName = this.isFollowing ? "destroy" : "create";
			if (!objectId) return;

			const result = await (this.api.favorites[methodName])({objectId, objectType:0});
			this.isFollowing = !this.isFollowing;
		}
	},

	async mounted() {
		this.parseData();
	}
}
</script>

<style scoped>
.container {
	margin:20px;
	display:flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.portrait {
	margin:20px;
	width: 160px;
	height: 160px;
	border-radius: 50%;
	/*border: 2px solid gray;*/
}

[v-cloak] {
	  display: none;

}
</style>
