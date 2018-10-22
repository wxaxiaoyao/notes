<template>
	<el-form label-width="80px">
		<el-form-item label="头像" v-if="isClient">
			<medias __style__="image" :__default_data__="mediasImageData"></medias>
		</el-form-item>
		<el-form-item label="昵称">
			<el-input v-model="userinfo.username" placeholder="昵称"></el-input>
		</el-form-item>
		<el-form-item label="类型">
			<el-radio-group v-model="userinfo.sex">
				<el-radio label="男">男</el-radio>
				<el-radio label="女">女</el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item label="简介">
			<el-input v-model="userinfo.description" placeholder="简介"></el-input>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" @click="clickSubmitBtn">提交</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
import mod from "@/components/mods/common/mod.js";

export default {
	mixins: [mod],

	data: function() {
		return {
			userinfo:{nickname:""},
			isClient: false,
			mediasImageData:{},
		}
	},

	methods: {
		async clickSubmitBtn() {
			const portrait = this.mediasImageData.file;
			this.mediasImageData.file = null;
			if (portrait) {
				const name = portrait.name;
				const key= this.user.username +"/iamges/portrait" + (new Date()).getTime() + name.substring(name.lastIndexOf("."));
				const data = await g_app.upload(key, portrait);
				this.userinfo.portrait = data && ("/" + key);
			}

			const result = await this.api.users.update(this.userinfo);
			if (result.isErr()) {
				Message(result.getMessage());
				return;
			}

			this.setUser(this.userinfo);
			Message("用户信息修改成功");
		}
	},

	mounted() {
		this.authenticated();
		this.isClient = true;
		this.userinfo = {...this.user};
		this.mediasImageData.url = this.userinfo.portrait;
		this.mediasImageData.editable = true;
	}
}
</script>
