
<template>
	<div class="messages-input-container">
		<el-input 
			@keyup.native.ctrl.enter="enter" 
			@keyup.native.enter="send" 
			type="textarea" 
			v-model="text" 
			resize="none"
			placeholder="按 Ctrl + Enter 换行, Enter 发送消息"
		>
		</el-input>
	</div>
</template>

<script>

import _ from "lodash";
import common from "./common.js";

export default {
	mixins: [common],

	data: function() {
		return {
			text:"",
			enterKey: false,
		}
	},

	props: {
		__default_data__: {
			type: Object,
			default: function() {

			}
		}
	},

	computed: {
		currentSessionId() {
			return this.getData("__current_session_id__") || 0;
		},
	},

	methods: {
		async send() {
			if (this.enterKey){
				this.enterKey = false;
				return;
			} 

			this.text = this.text.trim();
			if (!this.text) return;

			const {username, id, portrait, nickname} = this.user;
			const msg = {
				sessionId:this.currentSessionId, 
				type:0,
				text: this.text,
				extra: {
					user:{username, userId:id, id, portrait, nickname},
				}
			}
			this.text = "";

			console.log("--send message--");
			g_app.socket.emit("push_messages", msg);
		},

		enter() {
			this.text += "\n";
			this.enterKey = true;
		}
	}
}
</script>

<style lang="scss">
.messages-input-container {
	.el-textarea__inner {
		height: 100%;
		border: none;
		padding:0px;
	}

	.el-textarea__inner:focus {
		border: none;
	}

	.el-textarea {
		height: 100%;
	}

}
</style>

<style scoped>
.messages-input-container {
	height: 100%;
}
</style>

