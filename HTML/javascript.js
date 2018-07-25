
//var ListItems = document.getElementsByClassName("listItems")[0];
var ListItems = $(".listItems")[0];
//var Template = document.getElementsByClassName("elementTemplate")[0];
var Template = $(".elementTemplate")[0];

$(".add").click(AddElement);
$(".draw").click(Draw);

InitTable();
AddElement();
$(".listItems").find(".course").val("CIS 9000");
$(".listItems").find(".start").val("8");
$(".listItems").find(".end").val("10");
Draw();

function InitTable() 
{

	for (var i = 1; i <= 46; i++) 
	{
		$(".outputTable").append("<div class=\"time\">" + Math.ceil(i/2) + ":" + (i%2 ? "00" : "30") + "</div>");
	}
}

function AddElement() 
{
	var newElem = Template.cloneNode(true);
	newElem.className = "element";
	ListItems.appendChild(newElem);
	
	//$(".remove").click(RemoveElement);
	$(newElem).children(".remove").click(RemoveElement);
}

function RemoveElement()
{
	//ListItems.removeChild(this.parentNode);
	$(this).parent().remove();
}


function NewTableElement(course, start, end)
{
	//var newElem = document.createElement("div");
	//newElem.className = "course";
	
	
	return "<div class=\"course\" style=\"grid-row: " + (start+1) + "/" + (end+1) + "; grid-column:2/2;\">" + course + "</div>";
}

function Draw()
{
	console.log("draw");
	//var tableElements = $(".TableElements");
	var outputTable = $(".outputTable");
	//tableElements.empty();
	outputTable.children(".course").remove();
	
	//var childNodes = ListItems.childNodes;
	var childNodes = $(".listItems").children();
	for (var i = 0; i < childNodes.length; i++)
	{
		//var course = childNodes[i].getElementsByClassName("course")[0].value;
		//var start = childNodes[i].getElementsByClassName("start")[0].value;
		//var end = childNodes[i].getElementsByClassName("end")[0].value;
		
		var course = childNodes.children(".course")[i].value;
		var start = parseInt(childNodes.children(".start")[i].value);
		var end = parseInt(childNodes.children(".end")[i].value);
		console.log(i + " " + course + " " + start + "-" + end);
		
		outputTable.append(NewTableElement(course, start, end));
		
	}
}


