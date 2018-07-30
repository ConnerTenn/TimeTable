
// Listen for messages from the popup
chrome.runtime.onMessage.addListener(MessageHandler);
	
function MessageHandler(msg, sender, response)
{	
	// First, validate the message's structure
	if (msg.type === 'getData') 
	{
		console.log("Sending Response");
		response({id: 1, val: 56});
	}
	else
	{
		console.error("Unrecognised message: ", message);
	}
	console.log("Done Event");
}

$(document).ready(function (){
	console.log($(".WBST_Bars:contains(Students)").html());
	//$(".WBST_Bars:contains(Students)").trigger("click");
	//$(".WBST_Bars:contains(Students)").trigger("follow");
	//$(".WBST_Bars:contains(Students)").click();
	ClickEvent($(".WBST_Bars:contains(Students)")[0]);
	console.log("Did it work?");
	
	
});

function ClickEvent(element)
{
	var event = document.createEvent("MouseEvents");
	event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
	element.dispatchEvent(event);  
}
