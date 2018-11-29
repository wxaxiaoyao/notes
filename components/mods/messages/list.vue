
<template>
	<div ref="msgs" class="messages-list-container">
		<div v-for="(x, i) in msgs" :key="i" class="message-container">
			<img class="portrait" :src="x.extra.user.portrait">
			<div class="messages-right-container">
				<div class="message-header-container">
					{{x.extra.user.nickname + " @" + x.extra.user.username}}
				</div>
				<div class="message-body-container">
					<div class="message-content-container">
						<messages __style__="text" :__default_data__="x"></messages>
					</div>
					<span class="message-date">{{x.createdAt | msgTimeFilter}}</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import _ from "lodash";
import moment from "moment";

import common from "./common.js";

export default {
	mixins:[common],

	data: function() {
		return {
			msgs:[],
			sessionMsgs:{},
		}
	},

	props: {
	},

	computed: {
	},

	filters: {
		msgTimeFilter(datestr) {
			const date = new Date(datestr);
			const curdate = new Date(moment().format("YYYY-MM-DD"));
			const day = 1000 * 3600 * 24;
			const timestamp = curdate.getTime() -date.getTime();
			if (timestamp < 0)  return moment(datestr).format("HH:mm");

			if (timestamp < day) return "昨天" + moment(datestr).format("HH:mm");
			
			if (timestamp < day * 356) return moment(datestr).format("MM-DD HH:mm");
			
			return moment(datestr).format("YYYY-MM-DD HH:mm");
		}

	},

	watch: {
		socketState: function(state) {
			this.init();
		},

		currentSessionId: async function(sessionId) {
			const msgs = await this.getSessionMsgs(sessionId);

			this.sessionMsgs[sessionId] = msgs;

			this.msgs = msgs;

			this.scrollMsgList();
		},
	},

	methods: {
		init() {
			const self = this;
			
			self.sessionMsgs[0] = self.msgs;

			// socket init
			if (self.inited || self.socketState != "connect") return;
			self.inited = true;

			g_app.socket.on("push_messages", message => {
				console.log("push_messages", message);
				const {sessionId} = message;
				if (self.currentSessionId == sessionId)	self.msgs.push(message);
				else if (self.sessionMsgs[sessionId]) self.sessionMsgs[sessionId].push(message);

				this.scrollMsgList();
			});

			g_app.socket.on("pull_messages", data => {
				const {sessionId} = data;
				const msgs = this.sessionMsgs[sessionId] || [];
				_.each(msgs, msg => msg.state = 1);
			});
		},

		scrollMsgList() {
			const el = this.$refs.msgs;
			if (!el) return;
			setTimeout(() => {
				el.scrollTop = el.scrollHeight;
			},100);
		},

		async handleSessionMsg(data) {
			if (data.userId == this.user.id) return;
			_.each(this.__data__.msgs, x => x.msg.state = 1);
		},

		async getSessionMsgs(sessionId) {
			if (this.sessionMsgs[sessionId]) {
				return this.sessionMsgs[sessionId];
			}

			const msgs = await new Promise((resolve, reject) => {
				g_app.socket.emit("pull_messages", {sessionId}, msgs => {
					resolve(msgs || []);
				});
			});

			return msgs;
		},
	},

	mounted() {
		this.init();
	}
}
</script>

<style>
</style>

<style scoped>
.messages-list-container {
	background-color:rgb(247,247,247);
	height:100%;
	overflow-y:auto;
	/*padding-bottom: 100px;
	box-sizing: border-box;*/
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
	display: flex;
	align-items: flex-end;
}
.message-content-container {
	background-color: white;
	padding: 10px;
	border-radius:10%;
	white-space:normal;
	position: relative;
}
.message-date {
	margin-left:10px;
}
.portrait {
	width:40px;
	height:40px;
	border-radius: 50%;
	margin: 0px 4px;
}
</style>
