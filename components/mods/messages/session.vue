
<template>
	<div class="messages-session-container">
		<el-dialog class="dialogs-container" title="选择会话成员" :visible.sync="sessionDialogVisible" @close="sessionDialogVisible = false" width="600px">
			<div style="display:flex; justify-content:center">
				<el-transfer filterable filter-placeholder="请输入用户名过滤" v-model="members" :data="users"></el-transfer>
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
			class="session-container" @click="clickSessionItem(x)">
			<img :src="logos[i]" class="logo">
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
				sessionId: "system session",
				title: "系统消息",
			},
			session:{},
			sessions:[],

			sessionDialogVisible:false,
			users:[
			{label:"xiaoyao", key:1},
			{label:"xiaoyao2", key:2},
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
		async clickNewSessionBtn() {
			const memberIds = [];
			_.each(this.members, id => memberIds.push(_.toNumber(id)));
			g_app.socket.emit("push_sessions", {memberIds});
		},

		async loadSessions() {
			g_app.socket.emit("pull_sessions", {}, (sessions = []) => {
				sessions.splice(0,0, this.systemSession);
				this.sessions = sessions;
			});
		},

		async clickSessionItem(x) {
			this.setCurrentSessionId(x.sessionId);
			this.session = x;
		},

		init() {
			const self = this;

			// socket init
			if (self.inited || self.socketState != "connect") return;
			self.inited = true;

			self.loadSessions();

			g_app.socket.on("push_sessions", session => {
				const index = _.findIndex(this.sessions, o => o.sessionId == session.sessionId);
				if (index >= 0) return; 

				this.sessions.push(session);
			});
		}
	},

	async mounted() {
		this.session = this.systemSession;
		this.sessions.push(this.systemSession);
	
		this.init();
	}
}
</script>

<style scoped>
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
	cursor: pointer;
	display:flex;
	align-items: center;
	height:60px;
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
	margin: 0px 14px;
}
</style>
