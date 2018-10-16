<template>
	<div>
		<ImgInputer v-model="__data__.file" :img-src="__data__.url" :readonly="!__data__.editable"></ImgInputer>
	</div>
</template>

<script>
import vue from "vue";
import axios from "axios";
import ImgInputer from 'vue-img-inputer'
import 'vue-img-inputer/dist/index.css'

import mod from "@/components/mods/common/mod.js";

vue.component('ImgInputer', ImgInputer)

export default {
	mixins:[mod],

	data:function(){
		return {
		}
	},
	props:{
		__default_data__: {
			type: Object,
			default: function() {
				return {
					url:"",
					editable:false,
				};
			}
		}
	},
	methods: {
	},
	mounted() {
		console.log(this.__data__);
	},
}
</script>

<style scoped>
</style>
