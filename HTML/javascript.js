
var Container = document.getElementsByClassName("elementContainer")[0];
var Template = document.getElementsByClassName("elementTemplate")[0];

document.getElementsByClassName("add")[0].addEventListener('click', AddElement);

document.getElementsByClassName("draw")[0].addEventListener('click', Draw);

InitTable();
AddElement();
Container.childNodes[0].getElementsByClassName("course")[0].value = "CIS 9000";
Container.childNodes[0].getElementsByClassName("start")[0].value = "8";
Container.childNodes[0].getElementsByClassName("end")[0].value = "10";
Draw();

function InitTable() 
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

function AddElement() 
{
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
	Container.removeChild(this.parentNode);
}


function NewTableElement(course, start, end)
{
	var newElem = document.createElement("div");
	newElem.className = "TableElement";
	newElem.innerHTML = course;
	newElem.style.top = 21 + 30*start + "px";
	newElem.style.left = 78 + "px";
	newElem.style.width = "296px";
	newElem.style.height = 19 + 30*(end-start-1) + "px";
	return newElem;
}

function Draw()
{
	console.log("draw");
	tableElements = document.getElementsByClassName("TableElements")[0];
	
	while (tableElements.hasChildNodes()) 
	{
		tableElements.removeChild(tableElements.childNodes[0]);
	}
	
	var childNodes = Container.childNodes;
	for (var i = 0; i < childNodes.length; i++)
	{
		var course = childNodes[i].getElementsByClassName("course")[0].value;
		var start = childNodes[i].getElementsByClassName("start")[0].value;
		var end = childNodes[i].getElementsByClassName("end")[0].value;
		console.log(i + " " + course + " " + start + "-" + end);
		
		tableElements.appendChild(NewTableElement(course, start, end));
	}
}


