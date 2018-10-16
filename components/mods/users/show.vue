
<template>
	<div class="container">
		<img :src="user.portrait" class="portrait">
		<span class="username">{{user.username}}</span>
		<span class="description">{{user.description}}</span>
		<div>
		</div>
	</div>
</template>

<script>

import mod from "@/components/mods/common/mod.vue";
export default {
	mixins: [mod],
}
</script>

<style scoped>
.container {
	display:flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.container .portrait {
	width: 80px;
	height: 80px;
	border-radius: 50%;
}
.container .username {
	font-size:16px;

}
.container .description {
	font-size:12px;
}
</style>
