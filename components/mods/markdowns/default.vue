
<template>
	<div v-html="html"></div>
</template>

<script>

import md from "@/lib/markdown/index.js";
import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],
	data: function() {
		return {
		}
	},

	computed: {
		html() {
			return md.render(this.__data__.text); 
		},
	},

	mounted() {
		//console.log(this);
	},
}
</script>

