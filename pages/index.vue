<template>
	<div class="index-container">
		<div class="header-container" v-show="loaded">
			<headers __style__="system"></headers>
		</div>
		<div class="index-body-container">
		</div>
		<div class="footer-container" v-show="loaded">
			<footers __style__="system"></footers>
		</div>
	</div>
</template>

<script>
import vue from "vue";
import axios from "axios";
import {mapGetters, mapActions, mapMutations} from "vuex";
import component from "@/components/component.js";
import config from "@/config";

export default {
	layout: "blank",

	mixins: [component],

	components: {
	},

	head() {
		return {
			title:"首页",
		}
	},

	data: function() {
		return {
			loaded: false,
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
	},

	beforeMount() {
		if (this.isSmallScreen) {
			this.$router.replace({path:"/note/cellphones/index"});
		} else {
			this.loaded = true;
		}
	},
}
</script>

<style scoped>
.index-container {
	height:100%;
	width:100%;
	display: flex;
	flex-direction: column;
}
.index-body-container {
	flex:1;
}
</style>
