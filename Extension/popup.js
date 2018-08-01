
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
		console.log(data.val);
		document.getElementsByClassName('data'+data.id)[0].innerHTML = data.val;
	}
}

/*window.addEventListener('DOMContentLoaded', OnceLoaded);
var loaded = false;
function OnceLoaded() {
	console.log("Loaded");
	loaded = true;
};*/
var loaded = true;

$("button").click(DoUpdate);


function DoUpdate()
{
	if (loaded)
	{
		console.log("Doing Update");
		chrome.tabs.query({ active: true, currentWindow: true },
				function (tabs) {
					chrome.tabs.sendMessage(tabs[0].id, { type: 'getData' }, update);
					chrome.runtime.sendMessage({ type: 'getData' }, update);
				});
	}
}
