
<template>
	<el-dialog class="dialogs-container" :title="__data__.title" :visible.sync="__data__.visible" @close="clickCancelBtn" width="400px">
		<div>
			<el-transfer filterable :filter-placeholder="请输入用户名过滤" v-model="members" :data="users"></el-transfer>
		</div>
		<span slot="footer" class="dialog-footer">
			<el-button :type="__data__.primary == 'cancel' ? 'primary' : ''" @click="clickCancelBtn">取消</el-button>
			<el-button :type="__data__.primary == 'confirm' ? 'primary' : ''" @click="clickConfirmBtn">确定</el-button>
		</span>
	</el-dialog>
</template>

<script>
import {
	Dialog,
} from "element-ui";

import mod from "@/components/mods/common/mod.js";
export default {
	mixins: [mod],

	components: {
		[Dialog.name]: Dialog,
	},

	data: function() {
		return {
			default_data: {
				visible: false,
				title: "title",
				content: "dialog content",
				primary: "cancel",
				name: "",
			}
		}
	},

	methods: {
		clickConfirmBtn() {
			this.__data__.visible = false;
			this.__data__.success && this.__data__.success(this.__data__);
		},
		clickCancelBtn() {
			this.__data__.visible = false;
			this.__data__.fail && this.__data__.fail();
		}
	}
}

</script>

<style lang="scss">
.dialogs-container {
	.el-dialog__body {
		padding: 10px 20px;
	}
}
</style>
<style scoped>
.content {
	text-align: center;
}
.tip {
	margin-bottom:10px;
}
</style>
