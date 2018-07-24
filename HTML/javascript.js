
//var Container = document.getElementsByClassName("elementContainer")[0];
var Container = $(".elementContainer")[0];
//var Template = document.getElementsByClassName("elementTemplate")[0];
var Template = $(".elementTemplate")[0];

$(".add").click(AddElement);
$(".draw").click(Draw);

InitTable();
AddElement();
$(".elementContainer").find(".course").val("CIS 9000");
$(".elementContainer").find(".start").val("8");
$(".elementContainer").find(".end").val("10");
Draw();

function InitTable() 
{

	for (var i = 1; i <= 12; i++) 
	{
		$(".outputTable").append("<tr><td class=\"time\" num=\"" + i + "\">" + i + "</td><td class=\"chart\" num=\"" + i + "\"></td></tr>");
	}
}

function AddElement() 
{
	var newElem = Template.cloneNode(true);
	newElem.className = "element";
	Container.appendChild(newElem);
	
	//$(".remove").click(RemoveElement);
	$(newElem).children(".remove").click(RemoveElement);
}

function RemoveElement()
{
	//Container.removeChild(this.parentNode);
	$(this).parent().remove();
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
	var tableElements = $(".TableElements");
	
	tableElements.empty();
	
	//var childNodes = Container.childNodes;
	var childNodes = $(".elementContainer").children();
	for (var i = 0; i < childNodes.length; i++)
	{
		//var course = childNodes[i].getElementsByClassName("course")[0].value;
		//var start = childNodes[i].getElementsByClassName("start")[0].value;
		//var end = childNodes[i].getElementsByClassName("end")[0].value;
		
		var course = childNodes.children(".course")[i].value;
		var start = childNodes.children(".start")[i].value;
		var end = childNodes.children(".end")[i].value;
		console.log(i + " " + course + " " + start + "-" + end);
		
		tableElements.append(NewTableElement(course, start, end));
		
	}
}


