
<template>
	<div class="messages-session-container">
		<div class="session-header-container">
			<span>会话</span><i class="new-session-icon iconfont icon-plus"></i>
		</div>
		<div v-for="(x, i) in __data__.sessions" :key="i"  
			:class="[currentSessionId == x.sessionId ? 'current-session' : '']" 
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
	"http://pf0t54gda.bkt.clouddn.com/portraits/1.jpg",
];

export default {
	mixins:[common],

	data: function() {
		return {
			logos,
			systemSession: {
				sessionId:0,
				title: "系统消息",
			}
		}
	},

	props: {
		__default_data__: {
			type: Object,
			default: function() {
				return {
					sessions: [
					{
						title:"系统消息",
						sessionId:0,
					}
					]
				}
			}
		}
	},

	methods: {
		async getSessions() {
			const result = await this.api.sessions.get();
			const sessions = result.data || [];

			sessions.splice(0,0, this.systemSession);
			this.__data__.sessions = sessions;
			console.log(sessions);
		},

		async clickSessionItem(x) {
			this.setData("__current_session_id__", x.sessionId);
			await this.api.sessions.current({id:x.sessionId});
		},
	},

	async mounted() {
		await this.getSessions();
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
