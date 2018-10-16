
<template>
	<div class="index-container">
		<messages></messages>
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

	components: {
	},

	head() {
		return {
		}
	},

	data: function() {
		return {
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
	height:100%;
	width:100%;
}
</style>
