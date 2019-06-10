/*
	@desc		List of short URLs
	@author		Arash Soleimani <arash@leomoon.com>
	@date		2019-05-30
*/
chrome.storage.local.get(['wikimedia_shorten_url_list'], function(result) {
	 if(result.wikimedia_shorten_url_list){
			list_data = result.wikimedia_shorten_url_list;
	 }
	 if(list_data){
		 let htmldata = "<ul>";
		 list_data.forEach((item)=>{
				if(item)	htmldata += "<li>"+item+"</li>";
		 });
		 htmldata += "</ul>";
		 document.getElementById("short_url_list").innerHTML = htmldata;
	 }
});