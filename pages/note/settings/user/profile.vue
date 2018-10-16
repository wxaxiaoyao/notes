<template>
	<el-form ref="form" :model="userinfo" label-width="80px">
		<el-form-item label="头像" v-if="isClient">
			<VueImgInputer v-model="portrait" :imgSrc="userinfo.portrait" theme="light" size="large"></VueImgInputer>
		</el-form-item>
		<el-form-item label="昵称">
			<el-input v-model="userinfo.nickname" placeholder="昵称"></el-input>
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
import {
	Form,
	FormItem,
	Button,
	Input,
	RadioGroup,
	Radio,
	Message,
} from "element-ui";

import component from "@/components/component.js";

export default {
	mixins: [component],
	components: {
		[Form.name]: Form,
		[FormItem.name]: FormItem,
		[Button.name]: Button,
		[Input.name]: Input,
		[RadioGroup.name]: RadioGroup,
		[Radio.name]: Radio,
	},

	data: function() {
		return {
			userinfo:{},
			isClient: false,
			portrait:null,
		}
	},

	methods: {
		async clickSubmitBtn() {
			if (this.portrait) {
				const name = this.portrait.name;
				const key= this.user.username +"/iamges/portrait" + (new Date()).getTime() + name.substring(name.lastIndexOf("."));
				const data = await g_app.upload(key, this.portrait);
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
		this.isClient = true;
		this.userinfo = {...this.user};
	}

}
</script>
