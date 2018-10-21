
import mod from "@/components/mods/common/mod.vue";

export default {
	mixins: [mod],

	methods: {
		handleCommand(cmd){
			if (cmd == "logout") {
				this.setUser()
				this.$router.push({path:"/note/users/login"});
				this.api.users.logout();
				return;
			}
			
			if (cmd == "user-profile") {
				this.$router.push({path:"/" + this.user.username});
				return ;
			}

			if (cmd == "admins") {
				window.open("/admin");
				return;
			}
			this.$router.push({path: "/note/" + cmd});
		},
		clickLoginBtn() {
			this.$router.push({path:"/note/users/login"});
		},
		clickRegisterBtn() {
			this.$router.push({path:"/note/users/register"});
		},
	},
}
