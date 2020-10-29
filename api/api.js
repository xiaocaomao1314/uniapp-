// 公用地址
var headUrl = 'https://meituan.thexxdd.cn/api/'
// 引进错误提示
import {errdata} from 'api/errdata.js'
// 封装get方式api
export class HTTP {
	api(param){
		return new Promise((resolve,reject)=>{
			uni.request(param).then(res=>{
				console.dir(`${param.method}请求地址:${param.url}\n${res[1]}`)
				console.log(res[1])
				resolve(res[1])
			}).catch(err=>{
				let errs = '服务器错误 请稍后再试'
					errdata.errlist(errs)
					console.log(err)
					reject(err)
			})
		})
	}
	get(url){
		const param = {
			url:headUrl+url,
			method:"GET"
		}
		return this.api(param)
	}
	// 封装post方式api
	post(url,data){
		const param = {
			url:headUrl+url,
			method:"POST",
			data
		}
		return this.api(param)
	}
}

// 封装post

// // get请求
// let listing = function(urling){
// 	return new Promise((resolve,reject)=>{
// 		uni.request({
// 			url: urling,
// 			method: 'GET',
// 		})
// 		.then((res)=>{
// 			console.log(res)
// 			if(res[1].statusCode == 200){
// 				resolve(res[1])
// 			}else{
// 				let errs = '服务器错误 请稍后再试'
// 				errdata.errlist(errs)
// 			}
// 		})
// 		.catch((err)=>{
// 			let errs = '服务器错误 请稍后再试'
// 			errdata.errlist(errs)
// 			console.log(err)
// 			reject(err)
// 		})
// 	})
// }

// // post请求
// let publicing = function(urling,shopdata){
// 	return new Promise((resolve,reject)=>{
// 		uni.request({
// 			url: urling,
// 			method: 'POST',
// 			data:shopdata
// 		})
// 		.then((res)=>{
// 			if(res[1].statusCode == 200){
// 				resolve(res[1])
// 			}else{
// 				let errs = '服务器错误 请稍后再试'
// 				errdata.errlist(errs)
// 			}
// 		})
// 		.catch((err)=>{
// 			let errs = '服务器错误 请稍后再试'
// 			errdata.errlist(errs)
// 			reject(err)
// 		})
// 	})
// }

