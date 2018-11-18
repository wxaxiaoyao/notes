
<template>
	<div class="users-me-container">
		<div class="left-container">
			<img :src="user.portrait" class="portrait">
		</div>
		<div class="main-container">
			<div class="username">{{ (user.nickname || "") + " " + user.username}}</div>
			<div class="description">{{user.description}}</div>
		</div>
	</div>
</template>

<script>

import mod from "@/components/mods/common/mod.js";
export default {
	mixins: [mod],
}
</script>

<style lang="less" scoped>
.users-me-container {
	display:flex;
}
.left-container {
	padding:10px;
}
.portrait {
	width: 80px;
	height: 80px;
}
.main-container {
	padding: 20px 10px;
	.username {
		font-size:16px;
		font-weight: bold;
	}
	.description {
		margin-top:10px;
		font-size:12px;
	}

}
</style>
