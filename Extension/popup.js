// Update the relevant fields with the new data
function update(data) 
{
	if (typeof data == "undefined") {
		
		console.log("Undefined!");
		if (chrome.runtime.lastError) 
		{
			// We couldn't talk to the content script, probably it's not there
			console.error(chrome.runtime.lastError);
		}
	} 
	else 
	{
		document.getElementsByClassName('data'+data.id)[0].innerHTML = data.val;
	}
}

// Once the DOM is ready...
window.addEventListener('DOMContentLoaded', OnceLoaded);
$("button").click(DoUpdate);
var loaded = false;

function OnceLoaded() 
{
	console.log("Loaded");
	loaded = true;
};

function DoUpdate()
{
	if (loaded)
	{
		console.log("Doing Update");
		chrome.tabs.query({ active: true, currentWindow: true },
			function (tabs) {
				// ...and send a request for the DOM info...
				console.log("Tab:" + tabs[0].id);
				chrome.tabs.sendMessage(tabs[0].id, { type: 'getData' }, update);
				chrome.runtime.sendMessage({ type: 'getData' }, update);
			});
	}
}

