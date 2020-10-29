import {HTTP} from "./api.js"
const http = new HTTP();
console.log(HTTP,"请求地址",http.get)
import{getpreferurl,wxshopurl,startingurl,multipleurl,wxloginurl,wxpayingurl,searchurl,discussurl,shopurl,getdishesurl,commenturl} from './url.js'
export class API{
	getprefer(){
		return http.get(getpreferurl)
	}
	getwxshopurl(){
		return http.get(wxshopurl)
	}
	poststartingurl(data){
		return http.post(startingurl,data)
	}
	postmultipleurl(data){
		return http.post(multipleurl,data)
	}
	postsearchurl(data){
		return http.post(searchurl,data)
	}
	postshopurl(data){
		return http.post(shopurl,data)
	}
    postdiscussurl(data){
	   return http.post(discussurl,data)
   }
   postgetdishesurl(data){
	   return http.post(getdishesurl,data)
   }
   postwxloginurl(data){
	   return http.post(wxloginurl,data)
   }
   postwxpayingurl(data){
	   return http.post(wxpayingurl,data)
   }
   postcommenturl(data){
	   return http.post(commenturl,data)
   }
}

