
<template>
	<div class="messages-session-container">
		<el-dialog class="dialogs-container" title="选择会话成员" :visible.sync="sessionDialogVisible" @close="sessionDialogVisible = false" width="600px">
			<div style="display:flex; justify-content:center">
				<el-transfer filterable filter-placeholder="请输入用户名过滤" v-model="members" :data="users">
					<span slot-scope="{option}" class="user-container">
						<img class="user-portrait" :src="option.portrait || systemPortrait(option.username)"/>
						<div class="user-name-container">
							<span class="nickname">{{option.nickname || option.username}}</span>
							<span class="username">{{"@" + option.username}}</span>
						</div>
					</span>
				</el-transfer>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="sessionDialogVisible = false">取消</el-button>
				<el-button type="primary" @click="clickNewSessionBtn">确定</el-button>
			</span>
		</el-dialog>
		<div class="session-header-container">
			<span>会话</span><i class="new-session-icon iconfont icon-plus" @click="sessionDialogVisible = true"></i>
		</div>
		<div v-for="(x, i) in sessions" :key="i"  
			:class="[session.sessionId == x.sessionId ? 'current-session' : '']" 
			class="session-container" @click="clickSessionItem(x)" v-show="x.state == 0">
			<i class="iconfont icon-close" @click="clickCloseBtn(x, i)"></i>
			<img :src="x.logo" class="logo">
			<div class="session-right-container">
				{{x.title}}
			</div>
		</div>
	</div>
</template>

<script>
import _ from "lodash";
import common from "./common.js";

const logos = [
	"http://statics.qiniu.wxaxiaoyao.cn/_/portraits/1.jpg",
];


export default {
	mixins:[common],

	data: function() {
		return {
			logos,
			systemSession: {
				id:0,
				sessionId: "systemsession",
				logo: "http://statics.qiniu.wxaxiaoyao.cn/_/portraits/s3.png",
				title: "系统消息",
				state: 0,
				user:{},
			},
			session:{},
			sessions:{},

			sessionDialogVisible:false,
			users:[
			{label:"xiaoyao", key:1},
			{label:"wxatest", key:4},
			],
			members:[],
		}
	},

	watch: {
		socketState: function(state) {
			this.init();
		},
	},

	methods: {
		async clickCloseBtn(x, index) {
			if (!x.id) return;
			await this.api.sessions.destroy({id:x.id});

			x.state = 1;
		},

		async clickNewSessionBtn() {
			const memberIds = [];
			console.log(this.members);
			_.each(this.members, id => memberIds.push(_.toNumber(id)));
			g_app.socket.emit("push_sessions", {memberIds});
			this.sessionDialogVisible = false;
		},

		formatSession(session) {
			const userId = this.user.id;
			const members = session.members;
			if (members.length == 2) {
				const other = members[0].userId == userId ? members[1] :members[0];
				session.title = session.title || other.nickname || other.username;
				session.logo = other.portrait || this.systemPortrait(other.username);
			} else {
				const names = [];
				_.each(members, o => names.push(o.nickname || o.username));
				session.title = session.title || names.join(" ");
				session.logo = session.user.portrait || this.systemPortrait(session.user.username);
			}

			return session;
		},

		async loadSessions() {
			g_app.socket.emit("pull_sessions", {}, (sessions = []) => {
				_.each(sessions, session => {
					this.$set(this.sessions, session.sessionId, this.formatSession(session));
				});
				console.log(this.sessions);
				//this.sessions = sessions;
			});
		},

		async clickSessionItem(x) {
			this.setCurrentSessionId(x.sessionId);
			this.session = x;
		},

		async loadContacts() {
			const result = await this.api.users.contacts();
			const users = result.data || [];
			_.each(users, o => {
				o.label = o.username;
				o.key = o.userId;
			});

			this.users = users;
		},

		async init() {
			const self = this;

			await this.loadContacts();

			// socket init
			if (self.inited || self.socketState != "connect") return;
			self.inited = true;

			self.loadSessions();

			g_app.socket.on("push_sessions", session => {
				this.$set(this.sessions, session.sessionId, this.formatSession(session));
			});

			g_app.socket.on("push_messages", message => {
				const {sessionId} = message;
				const session = this.sessions[sessionId];
				if (session.state == 1) {
					session.state = 0;
					this.api.sessions.update({id:session.id, state:0});
				}
			});
		}
	},

	async mounted() {
		this.sessions[this.systemSession.sessionId] = this.systemSession;
	
		this.init();
	}
}
</script>

<style lang="less">
.messages-session-container {
	.el-transfer-panel__item {
		/*height:40px;*/
	}
}

</style>
<style lang="less" scoped>
.session-header-container {
	height:30px;
	padding:10px;
	border: 1px solid #eeeeee;
}
.new-session-icon {
	margin-left:6px;
	padding:5px;
	border-radius:50%;
	background-color:rgb(235,235,235);
}
.session-container {
	position:relative;
	cursor: default;
	display:flex;
	align-items: center;
	height:60px;
}
.icon-close {
	position: absolute;
	display: none;
	font-size:10px;
	margin: 0px 1px;
}
.session-container:hover .icon-close {
	display:inline;
}
.session-container:hover {
	background-color: rgb(235,235,235);
}
.current-session {
	background-color: rgb(235,235,235);
}
.session-right-container {
}
.logo {
	width: 40px;
	height: 40px;
	border-radius: 50%;
	margin: 0px 8px 0px 14px;
}
.user-container {
	display:flex;
	align-items:center;

	.user-portrait {
		width:25px;
		height:25px;
		border-radius: 50%;
		margin: 0px 2px 0px 0px;
	}

	.user-name-container {
		display:flex;

		.nickname {
			font-size:14px;
		}

		.username {
			font-size: 12px;
			color:gray;
		}
	}
}
</style>
