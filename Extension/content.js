
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
