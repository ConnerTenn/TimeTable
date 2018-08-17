
/* === AutoGenerated Content === */

function InitScheduleGrid()
{
	for (var i = 0; i < (23-7)*2; i++)
	{
		$(".grid-container").append("<div class='grid-item time' style='grid-row: " + (i*2+2) + "/ span 2; grid-column: 1/1;'>" + ((Math.floor(i/2)+6)%12+1) + ":" + (i%2 ? "30" : "00") + ((i<=9?"am":"pm")) + "</div>");
		for (var j = 0; j < 7; j++)
		{
			$(".grid-container").append("<div class='grid-item space' style='grid-row:" + (i*2+2) + "/ span 2; grid-column: " + (j+2) + "/" + (j+2) + ";'></div>");
		}
	}
}

/* === End AutoGenerated Content === */




/* === Dynamic Element Handlers === */

function AutoCourseNames()
{
	var courseNames = $(".course.list-item").find(".course-name");
	for (var i = 0; i < courseNames.length; i++)
	{
		$(courseNames[i]).attr("placeholder", "Course "+(i+1));
	}
}

function AutoSectionNames()
{
	var courses = $(".course.list-item");
	for (var i = 0; i < courses.length; i++)
	{
		var sectionNames = $(courses[i]).find(".section-name");
		for (var j = 0; j < sectionNames.length; j++)
		{
			$(sectionNames[j]).attr("placeholder", "Section " + (j + 1));
		}
	}
}

$(".course-add").click(AddCourse);

var CourseTemplate = $(".course-template")[0];
function AddCourse()
{
	//generate new element
	var newElem = CourseTemplate.cloneNode(true);
	newElem.className = "course list-item";
	
	//bind buttons
	$(newElem).find(".section-add").click(AddSection);
	$(newElem).find(".accordion-button").click(AccordionClick);
	$(newElem).find(".course-remove").click(RemoveCourse);
	
	//add initial children
	AddSectionLoc($(newElem).find(".section-list-container"));
	
	//append to list
	$(".course-list-container").append(newElem);
	
	AutoCourseNames();
	AutoSectionNames();
}

function RemoveCourse()
{
	var list = $(this).closest(".course-list-container");
	$(this).closest(".course.list-item").remove();
	if (list.children().length<=0)
	{
		AddCourse();
	}
	
	AutoCourseNames();
}

var SectionTemplate = $(".section-template")[0];
function AddSection()
{
	AddSectionLoc($(this).siblings(".section-list-container"));

	AutoSectionNames();
}
function AddSectionLoc(location)
{
	//generate new element
	var newElem = SectionTemplate.cloneNode(true);
	newElem.className = "section list-item";
	
	//bind buttons
	$(newElem).find(".time-slot-add").click(AddTimeSlot);
	$(newElem).find(".accordion-button").click(AccordionClick);
	$(newElem).find(".section-remove").click(RemoveSection);
	
	//add initial children
	AddTimeSlotLoc($(newElem).find(".time-slot-list-container"));
	
	//append to list
	location.append(newElem);
	
}

function RemoveSection()
{
	var list = $(this).closest(".section-list-container");
	$(this).closest(".section.list-item").remove();
	if (list.children().length <= 0)
	{
		AddSectionLoc(list);
	}
	
	AutoSectionNames();
}

var TimeSlotTemplate = $(".time-slot-template")[0];
function AddTimeSlot()
{
	AddTimeSlotLoc($(this).siblings(".time-slot-list-container"));
}
function AddTimeSlotLoc(location)
{
	//generate new element
	var newElem = TimeSlotTemplate.cloneNode(true);
	newElem.className = "time-slot list-item";
	
	//bind buttons
	$(newElem).find(".time-slot-remove").click(RemoveTimeSlot);
	$(newElem).find("button.day-button").click(DayButtonClick);
	$(newElem).find(".time-start,.time-end").focusin(1, ShowTimePicker);
	$(newElem).find(".time-start,.time-end").focusout(HideTimePicker);
	
	//append to list
	location.append(newElem);
}

function RemoveTimeSlot()
{
	var list = $(this).closest(".time-slot-list-container");
	$(this).closest(".time-slot.list-item").remove();
	if (list.children().length <= 0)
	{
		AddTimeSlotLoc(list);
	}
}

$(".reserve-add").click(AddReserve);

var ReserveTemplate = $(".reserve-template")[0];
function AddReserve()
{
	//generate new element
	var newElem = ReserveTemplate.cloneNode(true);
	newElem.className = "reserve list-item";

	//bind buttons
	$(newElem).find(".time-slot-add").click(AddTimeSlot);
	$(newElem).find(".accordion-button").click(AccordionClick);
	$(newElem).find(".reserve-remove").click(RemoveReserve);

	//add initial children
	AddTimeSlotLoc($(newElem).find(".time-slot-list-container"));

	//append to list
	$(".reserve-list-container").append(newElem);
}

function RemoveReserve()
{
	var list = $(this).closest(".reserve-list-container");
	$(this).closest(".reserve.list-item").remove();

	AutoCourseNames();
}

/* === End Dynamic Element Handlers === */



/* === Accordian Handling === */

$(".accordion-button").click(AccordionClick);

function AccordionClick()
{
	this.parentElement.nextElementSibling.classList.toggle("active");
	if (this.parentElement.nextElementSibling.classList.contains("active"))
	{
		this.firstChild.classList.remove("fa-arrow-alt-circle-right")
		this.firstChild.classList.add("fa-arrow-alt-circle-down");
	}
	else
	{
		this.firstChild.classList.remove("fa-arrow-alt-circle-down")
		this.firstChild.classList.add("fa-arrow-alt-circle-right");
	}
}

/* === End Accordian Handling === */




/* === Course Handlers === */

/* === End Course Handlers === */




/* === Section Handlers === */

/* === End Section Handlers === */



/* === Time Slot Handlers === */

function DayButtonClick()
{
	this.classList.toggle("active");
}

/* === End Time Slot Handlers === */



/* === Schedule Handlers === */

var ActiveSchedule = 0;
$(".schedule-select-dec").click(DecrementActiveSchedule);
$(".schedule-select-inc").click(IncrementActiveSchedule);

function DecrementActiveSchedule()
{
	ActiveSchedule = Math.max(ActiveSchedule-1, 0);
	$(".schedule-select-disp").html(ActiveSchedule + 1);
	
	if (ValidSchedules.length) { DrawSchedule(); }
}
function IncrementActiveSchedule()
{
	ActiveSchedule = Math.max(Math.min(ActiveSchedule + 1, ValidSchedules.length - 1), 0);
	$(".schedule-select-disp").html(ActiveSchedule+1);
	
	if (ValidSchedules.length) { DrawSchedule(); }
}

function RefreshActiveScheduleVal()
{
	ActiveSchedule = Math.max(Math.min(ActiveSchedule, ValidSchedules.length - 1), 0);
	$(".schedule-select-disp").html(ActiveSchedule + 1);
}


var GridHeightOffset = 0;
$(".grid-container").mousemove(UpdateMouseLine);
$(".grid-container").mouseenter(function () { $(".mouse-line").removeClass("invisible"); GridHeightOffset = $(".grid-container").offset().top; } );
$(".grid-container").mouseleave(function () { $(".mouse-line").addClass("invisible"); });

function UpdateMouseLine(event)
{
	$(".mouse-line")[0].style.top=event.clientY - GridHeightOffset;
}

/* === Schedule Handlers === */


/* === General Handlers === */

/* time picker */

$(".time-picker").focusin(ShowTimePicker);
$(".time-picker").focusout(HideTimePicker);
var ActiveTimeBox = 0;
function ShowTimePicker(event)
{
	$(".time-picker").removeClass("hidden");
	if (event.data)
	{
		ActiveTimeBox = this;
		//console.log("Spawn ["+val+"]");
		
		$(".time-picker").offset({ top: this.offsetTop + this.clientHeight + 1, left: this.offsetLeft });
	}
}

function HideTimePicker(event)
{
	//ActiveTimeBox = 0;
	//console.log("Spawn ["+val+"]");
	$(".time-picker").addClass("hidden");
}

function PickTime()
{
	$(ActiveTimeBox).val(this.innerHTML);
	$(this).focusout();
}

function InitTimePicker()
{
	for (var i = 0; i < (23-7)*2; i++)
	{
		$(".time-picker").append("<div class=\"picker-elem\">" + ((Math.floor(i/2)+6)%12+1) + ":" + (i%2 ? "30" : "00") + ((i<=9?"am":"pm")) + "</div>");
	}
	$(".picker-elem").click(PickTime);
}


/* === End General Handlers === */



/* === Init Items === */

InitScheduleGrid();

InitTimePicker();

AddCourse();

/* === End Init Items === */
