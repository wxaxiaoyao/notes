
<template>
	<div ref="msgs" class="messages-list-container">
		<div v-for="(x, i) in __data__.msgs" :key="i" class="message-container">
			<img class="portrait" :src="x.user.portrait">
			<div class="messages-right-container">
				<div class="message-header-container">
					{{x.user.nickname + " @" + x.user.username}}
				</div>
				<div class="message-body-container">
					<messages __style__="text" :__default_data__="x.msg"></messages>
					<span class="message-date">12:41</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import _ from "lodash";

import common from "./common.js";

export default {
	mixins:[common],

	data: function() {
		return {
			sessionMsgs:{},
		}
	},

	props: {
		__default_data__: {
			type: Object,
			default: function() {
				return {
					msgs: [
					{
						user: {portrait:"/xiaoyao/iamges/portrait1538966461893.jpg", username:"xiaoyao", nickname:"逍遥"},
						msg: {text:"this is a message\n test", createdAt:"", type:"", state:""},
					},
					]
				}
			}
		}
	},

	computed: {
		text() {
			return this.__data__.text;
		},
	},

	filters: {
		text(str) {
			return str.replace("\n", "<br/>");
		}
	},

	watch: {
		msg: function(data) {
			if (data.cmd == 1) this.handleMsg(data);
			else if(data.cmd == 2) this.handleSessionMsg(data);
		},
		currentSessionId: async function(sessionId) {
			const msgs = await this.getSessionMsgs(sessionId);
			this.__data__.msgs = msgs;
		},
	},

	methods: {
		formatMsg(msg) {
			msg.extra = msg.extra || {};
			return {msg: msg, user:msg.extra.user || {}};
		},
		async handleMsg(data) {
			const msg = this.formatMsg(data);
			this.__data__.msgs.push(msg);

			const el = this.$refs.msgs;
			if (!el) return;
			setTimeout(() => {
				el.scrollTop = el.scrollHeight;
			},10);
		},
		async handleSessionMsg(data) {
			if (data.userId == this.user.id) return;
			_.each(this.__data__.msgs, x => x.msg.state = 1);
		},
		async getSessionMsgs(sessionId) {
			if (this.sessionMsgs[sessionId]) return this.sessionMsgs[sessionId];

			const result = await this.api.sessions.getMsgs({id: sessionId});
			const list = result.data || [];

			const msgs = [];
			_.each(list, msg => msgs.push(this.formatMsg(msg)));

			this.sessionMsgs[sessionId] = msgs;

			return msgs;
		},
		isSelfMessage(x) {
			return true;
		}
	},

}
</script>

<style>
</style>

<style scoped>
.messages-list-container {
	background-color:rgb(247,247,247);
	height:100%;
	overflow-y:auto;
}

.messages-list-container::-webkit-scrollbar {
	width:3px;
	height:1px;
}

.messages-list-container::-webkit-scrollbar-thumb {
	border-radius: 10px;
	-webkit-box-shadow: inset 0 0 0px rgba(0,0,0,0.2);
	background-color: #535353;
}

.messages-list-container::-webkit-scrollbar-track {
	border-radius: 10px;
	-webkit-box-shadow: inset 0 0 0px rgba(0,0,0,0.2);
	background-color: #EDEDED;
}

.message-container {
	display:flex;
	padding:10px 20px;
}
.self-message {
	float: right;
}
.message-header-container {
	padding:10px;
}
.message-body-container {
	display:inline-block;
	background-color: white;
	padding: 10px;
	border-radius:10%;
	white-space:normal;
	position: relative;
}
.message-date {
	position: absolute;
	right: -60px;
}
.portrait {
	width:40px;
	height:40px;
	border-radius: 50%;
	margin: 0px 4px;
}
</style>
