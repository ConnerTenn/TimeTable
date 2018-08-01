
// Listen for messages from the popup
chrome.runtime.onMessage.addListener(MessageHandler);
	
function MessageHandler(msg, sender, response)
{	
	// First, validate the message's structure
	if (msg.type === 'getData') 
	{
		console.log("Sending Response");
		$("div").html("HAHA")
		response({id: 1, val: 56});
	}
	else
	{
		console.error("Unrecognised message: ", message);
	}
	console.log("Done Event");
}

$(document).ready(function () {
	var students = $(".WBST_Bars:contains(Students)");
	if (!(typeof students == "undefined"))
	{
		console.log(students.html());
		ClickEvent(students[0]);
		console.log("Did it work?");
	}
	else 
	{ 
		console.log("No students");
	}
	
	
	
});

function ClickEvent(element)
{
	var event = document.createEvent("MouseEvents");
	if (event)
	{
		event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		element.dispatchEvent(event); 
	}
}
