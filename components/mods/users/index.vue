
<template>
	<div class="users-container">
		<div v-for="(x, i) in __data__.users" :key="i">
			<img :src="x.portrait" class="user-portrait-img" @click="clickRemoveBtn(i)">
		</div>
		<el-popover v-if="__data__.editable" v-model="isShowUserInput" @show="showUserInput" trigger="click">
			<el-autocomplete ref="userinput" v-model="user_name" :fetch-suggestions="queryUserList" @select="handleUserSelect" @blur="addUser">
				<template slot-scope="{item}">
					<div class="user-select-item-container">
						<img :src="item.portrait" class="user-select-portrait-img">
						<span class="user-select-username">{{item.username}}</span>
					</div>
				</template>
			</el-autocomplete>
			<el-button slot="reference" icon="iconfont icon-plus" class="new-user-btn"></el-button>
		</el-popover>
	</div>
</template>

<script>
import {
	Popover,
	Autocomplete,
} from "element-ui";

import mod from "@/components/mods/common/mod.js";
import _ from "lodash";

/*
- editable boolean 是否可以编辑
- users array 已选择的用户列表  用户对象 {userId, username, nickname, portrait}
- userlist array 可供选择的用户列表  不存在则用户接口查询
 */
export default {
	mixins: [mod],
	components: {
		[Popover.name]: Popover,
		[Autocomplete.name]: Autocomplete,
	},

	data: function() {
		return {
			isShowUserInput: false,
			user_name:"",
		}
	},

	props: {
		__default_data__: {
			type:Object,
			default: function() {
				return {
					users:[
					//{
						//portrait:"https://img2.woyaogexing.com/2018/08/07/76a56256770fc8c0!400x400_big.jpg",
					//},
					//{
						//portrait:"https://img2.woyaogexing.com/2018/08/07/76a56256770fc8c0!400x400_big.jpg",
					//},
					],
					//userlist: [];
					editable: false,
				}
			}
		}
	},

	methods: {
		clickRemoveBtn(index) {
			this.__data__.users.splice(index,1);
		},

		addUser() {
			const index = _.findIndex(this.userlist, u => u.username == this.user_name);

			if (index < 0) return;

			this.handleUserSelect(this.userlist[index]);
		},

		async queryUserList(queryString, cb) {
			queryString = queryString || "";
			
			let list = [];

			if (this.__data__.userlist) {
				list = _.filter(this.__data__.userlist, o => o.username.indexOf(queryString) >= 0);
			} else {
				const result = await this.api.users.get({"username-like": queryString + "%"});
				list = result.data || [];
			}
		
			_.each(list, val => val.value = val.username);

			this.userlist = list;
			cb(list);
		},

		handleUserSelect(item) {
			const index = _.findIndex(this.__data__.users, o => o.username == item.username);
			if (index < 0) {
				this.__data__.users.push({
					userId: item.userId,
					portrait: item.portrait,
					username: item.username,
					nickname: item.nickname,
				});
			}

			this.user_name = "";
			this.isShowUserInput = false;
		},

		showUserInput() {
			setTimeout(() => {
				this.$refs.userinput.focus();
			});
		}
	},

	mounted() {

	}
}

</script>

<style lang="scss" scoped>
.users-container {
	display: flex;
}
.user-portrait-img {
	width: 60px;
	height: 60px;
	border-radius: 50%;
}
.new-user-btn {
	width: 60px;
	height: 60px;
	border-radius: 50%;
}
.user-portrait-img:hover{
	 box-shadow:0px 0px 2px 3px #000;
}
.user-select-item-container {
	display:flex;
	align-items: center;
}

.user-select-portrait-img {
	width:30px;
	height:30px;
	border-radius: 50%;
}

.user-select-username {
	font-size:20px;
}
</style>
