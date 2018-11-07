
<template>
	<div class="messages-index-container">
		<div class="messages-index-left-container">
			<messages __style__="session"></messages>
		</div>
		<div  class="messages-index-right-container">
			<div ref="msgsContainer" class="message-list-container">
				<messages __style__="list"></messages>
			</div>
			<div class="message-input-container">
				<messages __style__="input"></messages>
			</div>
		</div>
	</div>
</template>

<script>
import _ from "lodash";

import common from "./common.js";

export default {
	mixins:[common],

	props: {
		__default_data__: {
			type: Object,
			default: function() {
				return {
				}
			}
		}
	},

	computed: {
		text() {
			return this.__data__.text;
		}
	},

	watch: {
	},

	filters: {
		text(str) {
			return str.replace("\n", "<br/>");
		}
	},

	watch: {
	},

	methods: {
	},

	mounted() {
		this.initSocket();
	}
}
</script>

<style>
</style>

<style scoped>
.messages-index-container {
	height:100%;
	display:flex;
}
.messages-index-left-container {
	height:100%;
	width:200px;
}
.messages-index-right-container {
	position:relative;
	display: flex;
	height:100%;
	flex:1;	
	flex-direction: column;
	justify-content: flex-end;
	align-items: flex-end;
}
.message-list-container {
	position: absolute;
	top: 0px;
	left: 0px;
	right: 0px;
	bottom: 200px;
}
.message-input-container {
	width:100%;
	height:200px;
}
</style>
