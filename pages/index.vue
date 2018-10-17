<template>
	<div class="index-container">
		<div class="index-body-container">
			<editors __style__="codemirror"></editors>
		</div>
	</div>
</template>

<script>
import vue from "vue";
import axios from "axios";
import {mapGetters, mapActions, mapMutations} from "vuex";
import component from "@/components/component.js";
import config from "@/config";
import SockJS from "sockjs-client";

export default {
	mixins: [component],
	layout: "index",

	components: {
	},

	head() {
		return {
			script: [
				//{src:"https://cdn.bootcss.com/sockjs-client/1.1.4/sockjs.min.js"},
			],
		}
	},

	data: function() {
		return {
			message: "",
		}
	},

	computed: {
	},

	watch: {
	},

	props: {
	},


	methods: {
	},

	mounted() {
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
