import * as qiniu from "qiniu-js";
import config from "@/config.js";
import ERR from "../error.js";
import util from "../util.js";

const qiniuUpload = async (key, file, token, params = {}, observer = {}) => {
	const api = g_app.api;
	if (!token) {
		const data = await api.files.token({
			key:key,
		});
		if (data.isErr()) {
			return ;
		}
		token = data.getData();
	}

	if (typeof(file) == "string") {
		file = new Blob([file], {type: "text/plain"});
	}

	const opts =  {
		token: token,
		putExtra: {
			mimeType: null,
			params: {
				//"x:varname":"x"
			},
		},
		config: {
			useCdnDomain: true,
		},
	}

	//console.log(file);

	const observable = qiniu.upload(file, key, opts.token, opts.putExtra, opts.config);
	const ok = await new Promise((resolve, reject) => {
		observable.subscribe({
			next(res) {
				observer.next && observer.next(res);
				//console.log(res);
			},
			error(err) {
				observer.error && observer.error(err);
				console.log(err);
				resolve(false);
				//console.log(err);
			},
			async complete(res){
				const result = await api.files.upsert({key:res.key, size:res.fsize, hash:res.hash});
				if (result.isErr()) {
					observer.error && observer.error();
					return resolve(false);
				}
				observer.complete && observer.complete(res);
				//console.log(res);
				resolve({
					hash:res.hash,
					key:key,
					size:res.fsize,
				});
			}
		});
	})

	if (!ok) return;

	ok.url = config.origin + "/" + util.getPathByKey(key); 

	return ok;
}

export default qiniuUpload;
