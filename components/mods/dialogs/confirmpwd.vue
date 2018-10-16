
<template>
	<div class="dialogs-container">
		<el-dialog title="密码验证" :visible.sync="__data__.visible" @close="clickCancelBtn" width="400px">
			<div slot="title">
				<div>密码验证 <span class="tipmsg">{{tipmsg}}</span></div>
			</div>
			<el-form ref="form" label-width="50px">
				<el-form-item label="密码">
					<el-input type="password" v-model="password" placeholder="请输入密码"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button :type="__data__.primary == 'cancel' ? 'primary' : ''" @click="clickCancelBtn">取消</el-button>
				<el-button :type="__data__.primary == 'confirm' ? 'primary' : ''" @click="clickConfirmBtn">确定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
import {
	Dialog,
	Form,
	FormItem,
} from "element-ui";

import mod from "@/components/mods/common/mod.js";
export default {
	mixins: [mod],

	components: {
		[Dialog.name]: Dialog,
		[Form.name]: Form,
		[FormItem.name]: FormItem,
	},

	data: function() {
		return {
			password: "",
			tipmsg: "",
		}
	},

	props: {
		__default_data__: {
			type: Object,
			default: function() {
				return {
					visible: false,
					primary: "cancel",

					success:null,
					fail:null,
				}
			}
		}
	},

	methods: {
		async clickConfirmBtn() {
			const password = this.password;
			const result = await this.api.users.confirmpwd({password});
			if (!result.data) {
				this.tipmsg = "密码错误";
				return;
			}

			this.__data__.visible = false;
			this.__data__.success && this.__data__.success();
		},
		clickCancelBtn() {
			this.__data__.visible = false;
			this.__data__.fail && this.__data__.fail();
		}
	}
}

</script>

<style>
.dialogs-container  {
	
}
.dialogs-container .el-dialog__body {
	padding-bottom:0px;
}
</style>
<style scoped>
.tipmsg {
	color: red;
}
</style>
