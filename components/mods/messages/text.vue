
<template>
	<span v-html="html"></span>
</template>

<script>

import common from "./common.js";

export default {
	mixins:[common],

	data: function() {
		return {
		}
	},

	props: {
		__default_data__: {
			type: Object,
			default: function() {
				return {
					text:"",
				}
			}
		}
	},

	computed: {
		html() {
			const htmlstr = this.__data__.text.replace(/\n/g, "<br/>");

			return htmlstr;
		}
	}

}
</script>
