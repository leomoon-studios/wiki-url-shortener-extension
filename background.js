/*
	@desc		Functions for Context Menu, LocalStorage and API call
	@author		Arash Soleimani <arash@leomoon.com>
	@date		2019-05-30
*/

// Create context menus 
chrome.runtime.onInstalled.addListener(function() {
	chrome.contextMenus.create({
	  "id": "create_url_from_selection_text",
	  "title": "Short-URL of selected text",
	  "contexts": ["selection"]
	});
	chrome.contextMenus.create({
	  "id": "create_url_from_link",
	  "title": "Short-URL of this link",
	  "contexts": ["link"]
	});
	chrome.contextMenus.create({
	  "id": "create_url_from_page_url",
	  "title": "Short-URL of Page",
	  "contexts": ["page"]
	});
});

// Onclick listener for context menu
chrome.contextMenus.onClicked.addListener((info, tab) => {
	if (info.menuItemId === "create_url_from_selection_text")
		call_api(info.selectionText);
	else if(info.menuItemId === "create_url_from_page_url")
		call_api(info.pageUrl);
	else if(info.menuItemId === "create_url_from_link")
		call_api(info.linkUrl);
});

/*
	Save short url to LocalStorage (chrome.sotrage.local)
	When using storage.sync, the stored data will automatically be synced to any Chrome browser that the user is logged into, provided the user has sync enabled.
*/
const save_shorturl = (data) => {
	let list_data = [];
	chrome.storage.local.get(['wikimedia_shorten_url_list'], function(result) {
	 if(result.wikimedia_shorten_url_list){
			list_data = result.wikimedia_shorten_url_list;
			while(list_data.length > 10) list_data.shift();
	 }
	 list_data.push(data);
		list_data.filter((item, index) => list_data.indexOf(item) === index);
		chrome.storage.local.set({wikimedia_shorten_url_list: list_data}, function() {
			// Imagine a world in which every single person on the planet has a short URL :)
		});
	});
};
/* 
	Call shorten-url api and return value
	The rate limit is 10 creations per 2 minutes for IPs and 50 for logged-in users
*/
const call_api = (url) => {
	var opts = {
		action: "shortenurl",
		format: "json",
		url: url
	};
	$.ajax({
		url: "https://meta.wikimedia.org/w/api.php",
		method: "POST",
		data: {
			action: "shortenurl",
			format: "json",
			url: url
		},
		dataType: "JSON",
		success: function(res) {
			if(res.shortenurl){
				alert(res.shortenurl.shorturl);
				save_shorturl(res.shortenurl.shorturl);
			}else if(res.error){
				alert(res.error.info);
			}
		}
	});
};

