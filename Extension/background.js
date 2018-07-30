

console.log("Started Background");

chrome.runtime.onMessage.addListener(function (msg, sender, response) {
	// First, validate the message's structure
	if (msg.type === 'getData') 
	{
		console.log("Sending Response");
		response({ id: 2, val: 81 });
	}
	else 
	{
		console.error("Unrecognised message: ", message);
	}
	console.log("Done Event");
});