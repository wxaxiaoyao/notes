
<template>
	<el-dialog :title="__data__.title" :visible.sync="__data__.visible" width="500px" @close="clickCancelBtn">
		<div class="content" v-html="__data__.content"></div>
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

	props: {
		__default_data__: {
			type: Object,
			default: function() {
				return {
					visible: false,
					title: "title",
					content: "dialog content",
					primary: "cancel",
				}
			}
		}
	},

	methods: {
		clickConfirmBtn() {
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

<style scoped>
.content {
	text-align: center;
}
</style>
