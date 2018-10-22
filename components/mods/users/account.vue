<template>
	<el-tabs>
		<el-tab-pane label="修改密码">
			<el-form ref="form" :model="password" label-width="120px">
				<el-form-item label="旧密码">
					<el-input type="password" v-model="password.oldpassword" placeholder="旧密码"></el-input>
				</el-form-item>
				<el-form-item label="新密码">
					<el-input type="password" v-model="password.newpassword" placeholder="新密码"></el-input>
				</el-form-item>
				<el-form-item label="确认新密码">
					<el-input type="password" v-model="password.confirmpassword" placeholder="确认新密码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="clickSubmitBtn">提交</el-button>
				</el-form-item>
			</el-form>
		</el-tab-pane>

		<el-tab-pane label="账号绑定">
			<div>
				<el-dialog :visible.sync="isShowCellphoneCaptchaDialog" title="手机验证码" width="450px">
					<el-form :model="cellphoneModel" label-width="80px" label-position="right" style="width:300px;">
						<el-form-item label="手机号">
							<el-col :span="18">
								<el-input clearable v-model="cellphoneModel.cellphone" placeholder="请输入手机号"></el-input>
							</el-col>
							<el-col :span="4" :offset="2">
								<el-button @click="clickSendCellphoneCaptchaBtn">{{timeout > 0 ? timeout + "S后可重新发送" : "发送验证码"}}</el-button>
							</el-col>
						</el-form-item>
						<el-form-item label="验证码">
							<el-col :span="18">
								<el-input clearable v-model="cellphoneModel.captcha" placeholder="请输入验证码"></el-input>
							</el-col>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click="isShowCellphoneCaptchaDialog = false">取 消</el-button>
						<el-button type="primary" @click="clickSubmitBindCellphoneBtn">确 定</el-button>
					</div>
				</el-dialog>

				<el-row>
					<el-col :span="2">
						<span>手机号</span>
					</el-col>
					<el-col :span="8">
						<span>{{cellphoneModel.cellphone}}</span>
					</el-col>
					<el-col :span="2">
						<el-button @click="isShowCellphoneCaptchaDialog = true">{{cellphoneModel.isBind ? "解绑" : "绑定"}}</el-button>
					</el-col>
				</el-row>
			</div>
			<div>
				<el-dialog :visible.sync="isShowEmailCaptchaDialog" title="邮箱验证码" width="450px">
					<el-form :model="emailModel" label-width="80px" label-position="right" style="width:300px;">
						<el-form-item label="邮箱">
							<el-col :span="18">
								<el-input clearable v-model="emailModel.email" placeholder="请输入邮箱地址"></el-input>
							</el-col>
							<el-col :span="4" :offset="2">
								<el-button @click="clickSendEmailCaptchaBtn">{{timeout > 0 ? timeout + "S后可重新发送" : "发送验证码"}}</el-button>
							</el-col>
						</el-form-item>
						<el-form-item label="验证码">
							<el-col :span="18">
								<el-input clearable v-model="emailModel.captcha" placeholder="请输入验证码"></el-input>
							</el-col>
						</el-form-item>
					</el-form>
					<div slot="footer" class="dialog-footer">
						<el-button @click="isShowEmailCaptchaDialog = false">取 消</el-button>
						<el-button type="primary" @click="clickSubmitBindEmailBtn">确 定</el-button>
					</div>
				</el-dialog>

				<el-row>
					<el-col :span="2">
						<span>邮箱</span>
					</el-col>
					<el-col :span="8">
						<span>{{emailModel.email}}</span>
					</el-col>
					<el-col :span="2">
						<el-button @click="isShowEmailCaptchaDialog = true">{{emailModel.isBind ? "解绑" : "绑定"}}</el-button>
					</el-col>
				</el-row>
			</div>
			<div v-for="(x, key) in oauthUsers" :key="key">
				<el-row>
					<el-col :span="2">
						<span>{{x.name}}</span>
					</el-col>
					<el-col :span="8">
						<span>{{x.nickname}}</span>
					</el-col>
					<el-col :span="2">
						<el-button @click="clickBindOauthUserBtn(x)">{{x.isBind ? "解绑" : "绑定"}}</el-button>
					</el-col>
				</el-row>
			</div>
		</el-tab-pane>
	</el-tabs>
</template>

<script>

import _ from "lodash";
import mod from "@/components/mods/common/mod.js";

	// 服务类型
const OAUTH_SERVICE_TYPE_QQ=0;      // QQ
const OAUTH_SERVICE_TYPE_WEIXIN=1;  // 微信
const OAUTH_SERVICE_TYPE_GITHUB=2;  // GITHUB
const OAUTH_SERVICE_TYPE_XINLANG=3; // 新浪

export default {
	mixins: [mod],
	components: {
	},

	data: function() {
		return {
			password: {},
			timeout: 0,
			isShowCellphoneCaptchaDialog: false,
			cellphoneModel: {
				cellphone: "",
				captcha: "",
				isBind: false,
			},
			isShowEmailCaptchaDialog: false,
			emailModel: {
				email: "",
				captcha: "",
				isBind: false,
			},
			oauthUsers: {
				qq: {
					type:'qq',
					name:"QQ",
					nickname:null,
					isBind: false,
				},
				weixin: {
					type:'weixin',
					name:"微信",
					nickname:null,
					isBind: false,
				},
				github: {
					type:'github',
					name: "GITHUB",
					nickname: null,
					isBind: false,
				},
				xinlang: {
					type:'xinlang',
					name:"新浪",
					nickname: null,
					isBind: false,
				},
			},
		}
	},

	methods: {
		startTimeout(timeout = 60) {
			const self = this;
			self.timeout = timeout;
			const start = () => {
				if (self.timeout > 0) self.timeout--;
				setTimeout(start, 1000);
			}
			setTimeout(start, 1000);
		},

		async clickSendCellphoneCaptchaBtn() {
			const reg = /^1\d{10}$/;
			const cellphone = this.cellphoneModel.cellphone || "";
			if (!reg.test(cellphone)) return Message("手机号格式错误");
			this.startTimeout();
			await this.api.users.cellphoneVerifyOne(this.cellphoneModel);
		},

		async clickSubmitBindCellphoneBtn() {
			const reg = /^1\d{10}$/;
			let cellphone = this.cellphoneModel.cellphone || "";
			if (!reg.test(cellphone)) return Message("手机号格式错误");
			this.cellphoneModel.isBind = !this.cellphoneModel.isBind;
			const result = await this.api.users.cellphoneVerifyTwo(this.cellphoneModel);

			this.isShowCellphoneCaptchaDialog = false;

			if (result.isErr()){
				this.cellphoneModel.isBind = !this.cellphoneModel.isBind;
				return Message(result.getMessage());
			} 

			if (this.cellphoneModel.isBind){
				Message("手机绑定成功");
			} else {
				this.cellphoneModel.cellphone = "";
				Message("手机解绑成功");
			}
			this.timeout = 0;
			this.cellphoneModel.captcha = "";
			this.setUser({cellphone:this.cellphoneModel.cellphone});
		},

		async clickSendEmailCaptchaBtn() {
			const reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
			const email = this.emailModel.email || "";
			if (!reg.test(email)) return Message("邮箱格式错误");
			this.startTimeout();
			await this.api.users.emailVerifyOne(this.emailModel);
		},

		async clickSubmitBindEmailBtn() {
			const reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
			let email = this.emailModel.email || "";
			if (!reg.test(email)) return Message("邮箱格式错误");

			this.emailModel.isBind = !this.emailModel.isBind;
			const result = await this.api.users.emailVerifyTwo(this.emailModel);
			this.isShowEmailCaptchaDialog = false;

			if (result.isErr()){
				this.emailModel.isBind = !this.emailModel.isBind;
				return Message(result.getMessage());
			}

			if (this.emailModel.isBind){
				Message("邮箱绑定成功");
			} else {
				this.emailModel.email = "";
				Message("邮箱解绑成功");
			}
			this.timeout = 0;
			this.cellphoneModel.captcha = "";
			this.setUser({email:this.emailModel.email});
		},

		async clickSubmitBtn() {
			const password = this.password;
			if (!password.newpassword) {
				return Message("密码格式错误");
			}
			if (password.newpassword != password.confirmpassword) {
				return Message("两次新密码不一致");
			}

			const result = await api.users.changepwd(password);			
			if (result.isErr()) {
				return Message(result.getMessage());
			}

			Message("密码修改成功");
		},

		async clickBindOauthUserBtn(oauthUser) {
			// 已经绑定 进行解绑
			if (oauthUser.isBind) {
				const result = await this.api.oauthUsers.delete({id:oauthUser.id});
				if (result.isErr()) return Message(result.getMessage());
				oauthUser.nickname = "";
				oauthUser.isBind = false;
				Message("帐号解绑成功");
				return;
			}
			
			const data = await this.$auth.authenticate(oauthUser.type, {state:"bind"}).then(res => res.data);
			oauthUser.nickname = data.externalUsername;
			oauthUser.isBind = true;
			Message("帐号绑定成功");
			//console.log(data);
		}
	},

	async mounted() {
		this.cellphoneModel.cellphone = this.user.cellphone;
		this.cellphoneModel.isBind = this.user.cellphone ? true : false;

		this.emailModel.email = this.user.email;
		this.emailModel.isBind = this.user.email ? true : false;

		let oauthUsers = await this.api.oauthUsers.find();
		oauthUsers = oauthUsers.getData();

		const self = this;
		const typeMap = {
			[OAUTH_SERVICE_TYPE_QQ]: "qq",
			[OAUTH_SERVICE_TYPE_WEIXIN]: "weixin",
			[OAUTH_SERVICE_TYPE_GITHUB]: "github",
			[OAUTH_SERVICE_TYPE_XINLANG]: "xinlang",
		}
		_.each(oauthUsers, obj => {
			//console.log(typeMap[obj.type], obj.type, typeMap);
			self.oauthUsers[typeMap[obj.type]].nickname = obj.externalUsername;
			self.oauthUsers[typeMap[obj.type]].isBind = true;
			self.oauthUsers[typeMap[obj.type]].id = obj.id;

		});
	}
}
</script>
