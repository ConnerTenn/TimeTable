
var AddButton = document.getElementsByClassName("add")[0];
var Container = document.getElementsByClassName("elementContainer")[0];
var Template = document.getElementsByClassName("elementTemplate")[0];

AddButton.addEventListener('click', AddElement);

AddElement();


function AddElement() 
{
	console.log("AddList");
	/*var newElem = document.createElement("div");
	newElem.className = "element";
	var newElemChild = document.createElement("h2");
	newElemChild.className = "remove";
	newElemChild.innerHTML="Delete";
	newElem.appendChild(newElemChild);*/
	var newElem = Template.cloneNode(true);
	newElem.className = "element";
	Container.appendChild(newElem);
	
	newElem.getElementsByClassName("remove")[0].addEventListener('click', RemoveElement);
}

function RemoveElement()
{
	console.log("remove");
	Container.removeChild(this.parentNode);
}


{
	var outputTable = document.getElementsByClassName("outputTable")[0];
	//var times = document.getElementsByClassName("times")[0];
	
	for (var i = 1; i <= 12; i++)
	{
		var newElem = document.createElement("tr");
		newElem.innerHTML = "<td class=\"time\" num=\"" + i + "\">" + i + "</td><td class=\"chart\" num=\"" + i + "\"></td>";
		outputTable.appendChild(newElem);
	}
}

