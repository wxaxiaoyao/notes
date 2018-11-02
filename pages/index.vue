<template>
	<div class="index-container">
		<div class="index-body-container">
		</div>
	</div>
</template>

<script>
import vue from "vue";
import axios from "axios";
import {mapGetters, mapActions, mapMutations} from "vuex";
import component from "@/components/component.js";
import config from "@/config";
import io from "socket.io-client";

export default {
	mixins: [component],
	layout: "index",

	components: {
	},

	head() {
		return {
			script: [
			],
		}
	},

	data: function() {
		return {
			data:{tags:[]},
		}
	},

	computed: {
	},

	watch: {
	},

	props: {
	},


	methods: {
		init() {
			const log = console.log;
			const socket = io("http://127.0.0.1:8082/", {
				query: {
					room:"demo",
					userId: `client_${Math.random()}`,
				},
				transports: ['websocket'],
			});

			socket.on("connect", () => {
				const id = socket.id;
				log("#connect", id, socket);

				socket.on(id, msg => {
					log("#receive", msg);
				});
			});

			socket.on("online", msg => {
				log("#online", msg);
			});

			socket.on("disconnect", msg => {
				log("#disconnect", msg);
			});

			socket.on("disconnecting", () => {
				log("#disconnecting");
			});

			socket.on("error", () => {
				log("#error");
			});
			this.socket = socket;
			socket.emit("exchange", "hello world");
		}
	},

	mounted() {
		this.init();

	},

	destroyed() {
	}
}
</script>

<style scoped>
.index-container {
	position:relative;
	height:100%;
	width:100%;
}
.index-body-container {
	position:absolute;
	top:0px;
	bottom:0px;
	left:0px;
	right:0px;
}
</style>
