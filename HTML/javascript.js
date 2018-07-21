
var addList = document.getElementsByClassName("add");
var remList = document.getElementsByClassName("remove");
var container = document.getElementsByClassName("elementContainer")[0];

for (i = 0; i < addList.length; i++) 
{
	addList[i].addEventListener('click', Add);
}
for (i = 0; i < remList.length; i++) 
{
	remList[i].addEventListener('click', Remove);
}

var elementHtml = "<div class=\"element\">< h2 class=\"remove\" > Delete</h2 ></div >";

function Add() 
{
	console.log("addList");
	/*var itemClass = this.parentNode.className;
	for (i = 0; i < accItem.length; i++) {
		accItem[i].className = 'accordionItem close';
	}
	if (itemClass == 'accordionItem close') {
		this.parentNode.className = 'accordionItem open';
	}*/
	var newElem = document.createElement("div");
	newElem.className = "element";
	var newElemChild = document.createElement("h2");
	newElemChild.className = "remove";
	newElemChild.innerHTML="Delete";
	newElem.appendChild(newElemChild);
	
	container.appendChild(newElem);
	
	remList = document.getElementsByClassName("remove");
	remList[remList.length-1].addEventListener('click', Remove);
}

function Remove()
{
	console.log("remove");
	container.removeChild(this.parentNode);
}