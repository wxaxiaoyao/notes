
<template>
	<div class="headerContainer">
		<div class="personal-nickname">{{(__data__.nickname || {}).text}}</div>
		<div class="personal-motto">{{(__data__.motto || {}).text}}</div>
		<div></div>
	</div>
</template>

<script>

import mod from "@/components/mods/common/mod.js";

export default {
	mixins:[mod],
	components: {
	
	},
	props: {
		__data_type__: {
			type:Object, 
			default: function() {
				return {
					label: "headers",
					type: "object",
					items: {
						nickname: {
							label: "名称",
							type: "text",
						},
						motto: {
							label: "格言",
							type:"text",
						},
					}
				}
			}
		},
		__default_data__: {
			type: Object,
			default: function() {
				return {
					nickname: {
						text: "逍遥",
					},
					motto: {
						text: "天下熙熙皆为利来，天下攘攘皆为利往。"
					}
				}
			}
		},
	},

	mounted() {
		//console.log(this.__data__);
	}
}
</script>


<style scoped>
.headerContainer {
	height: 100px;
	padding-top: 20px;
}
.personal-nickname {
	font-size: 20px;
	color: black;
	font-weight: bold;
	margin-left: 20px;
}
.personal-motto {
	margin-top: 10px;
	margin-left: 40px;
	font-size: 16px;
	color: gray;
}
</style>
