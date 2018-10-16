import nodemailer from "nodemailer";

import config from "@/config.js";

const transporter = nodemailer.createTransport({
	host: config.email.host,
	port: config.email.port || 587,
	secure: false,
	auth: {
		user: config.email.user,
		pass: config.email.pass,
	},
});

const from = config.email.from || config.email.user;

// 连接验证
//transporter.verify(function(error, success) {
	//if (error) {
		//console.log(error);
	//} else {
		//console.log("server is ready to take our messages");
	//}
//})


export const sendEmail = async function(to, subject, html, from) {
	from = from || config.email.from || config.email.user;

	const ok = await new Promise((resolve, reject) => {
		transporter.sendMail({
			from,
			to,
			subject,
			html,
		}, function(err) {
			if (err) {
				console.log(err);
				return resolve(false);
			}

			return resolve(true);
		});
	});

	return ok;
}

export default {};
