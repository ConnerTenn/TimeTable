

console.log("It works");

/* === Dynamic Element Handlers === */

function AddCourse()
{
	//Copy template and append to end of dynamic list
	//Bind Buttons
	//add initial empty section
}

function DeleteCourse()
{
	//if last course is being deleted, add initial empty course
}

function AddSection()
{
	//Copy template and append to end of dynamic list
	//Bind Buttons
	//add initial empty timeslot
}

function DeleteSection()
{
	//if last course is being deleted, add initial empty section
}

function AddTimeSlot()
{
	//Copy template and append to end of dynamic list
	//Bind Buttons
}

function DeleteTimeSlot()
{
	//if last course is being deleted, add initial empty timeslot
}

/* === End Dynamic Element Handlers === */


/* === Accordian Handling begins here === */

/*var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight){
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    } 
  });
}*/

$("button.accordion").click(AccordionClick);

function AccordionClick()
{
	this.nextElementSibling.classList.toggle("active");
}


/* === Accordian Handling ends here === */


/* === Button Handlers === */


/* Course */

/* Section */

/* TimeTable */

$("button.day-button").click(DayButtonClick);

function DayButtonClick()
{
	this.classList.toggle("active");
}

/* Schedule */

function GenerateSchedule()
{
	
}

function DrawSchedule()
{
	
}


/* === End Button Handlers === */



