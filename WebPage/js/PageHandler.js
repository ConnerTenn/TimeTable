

/* === AutoGenerated Content === */

/*function InitScheduleGrid()
{	
	for (var i = 1; i < (23 - 7) * 2; i++)
	{
		$(".time-column").append("<div class='time-label-spacer'><div class='time-label'>" + ((Math.floor(i / 2) + 6) % 12 + 1) + ":" + (i % 2 ? "30" : "00") + ((i <= 9 ? "am" : "pm")) + "</div></div>");
		$(".time-divider-container").append("<div class='time-divider'></div>");
	}
}*/

/* === End AutoGenerated Content === */




/* === Accordian Handling === */

$(".accordion-button").click(AccordionClick);

function AccordionClick()
{
	//this.parentElement.nextElementSibling.classList.toggle("active");
	$(this).parent().siblings(".accordion-content").toggleClass("active");
	if ($(this).parent().siblings(".accordion-content").hasClass("active"))
	{
		this.firstChild.classList.remove("fa-arrow-alt-circle-right")
		this.firstChild.classList.add("fa-arrow-alt-circle-down");
	}
	else
	{
		this.firstChild.classList.remove("fa-arrow-alt-circle-down")
		this.firstChild.classList.add("fa-arrow-alt-circle-right");
	}
	
	return false;
}

/* === End Accordian Handling === */




/* === Course Handlers === */

//bind buttons
$(".course-add").click(AddCourse);
$(".course-remove").click(RemoveCourse);
$(".course-clone").click(CloneCourse);

function AutoCourseNames()
{
	var $courseNames = $(".course.list-item").find(".course-name");
	for (var i = 0; i < $courseNames.length; i++)
	{
		$($courseNames[i]).attr("placeholder", "Course " + (i + 1));
	}
}


function AddCourse()
{
	//generate new element
	var $newElem = $CourseTemplate.clone(true);
	$newElem[0].className = "course list-item";

	var colour = GetColour();
	//$(newElem).find(".colour")[0].style.background=colour;
	//$(newElem).find(".colour").attr("colour", colour);
	$newElem.find(".colour").css("background", colour);
	$newElem.find(".colour").attr("colour", colour);
	//$(newElem).find(".accordion-header")[0].style.background = colour;
	//$(newElem)[0].style.background = colour;


	//add initial children
	AddSectionLoc($newElem.find(".section-list-container"));

	//append to list
	$(".course-list-container").append($newElem);

	AutoCourseNames();
	AutoSectionNames();
	AutoTimeSlotNames();
}

function RemoveCourse()
{
	var $list = $(this).closest(".course-list-container");
	$(this).closest(".course.list-item").remove();
	if ($list.children().length <= 0)
	{
		AddCourse();
	}

	AutoCourseNames();
}

function CloneCourse()
{
	var $newElem = $(this).closest(".course.list-item").clone(true);
	var colour = GetColour();
	$newElem.find(".colour").css("background", colour);
	$newElem.find(".colour").attr("colour", colour);
	$(this).closest(".course.list-item").after($newElem);
	AutoCourseNames();
	AutoSectionNames();
	AutoTimeSlotNames();
}

/* === End Course Handlers === */



/* === Section Handlers === */

//bind buttons
$(".section-add").click(AddSection);
$(".section-remove").click(RemoveSection);
$(".section-clone").click(CloneSection);

function AutoSectionNames()
{
	var $courses = $(".course.list-item");
	for (var i = 0; i < $courses.length; i++)
	{
		var $sectionNames = $($courses[i]).find(".section-name");
		for (var j = 0; j < $sectionNames.length; j++)
		{
			$($sectionNames[j]).attr("placeholder", "Section " + (j + 1));
		}
	}
}

function AddSection()
{
	AddSectionLoc($(this).siblings(".section-list-container"));

	AutoSectionNames();
	AutoTimeSlotNames();
}
function AddSectionLoc($location)
{
	//generate new element
	var $newElem = $SectionTemplate.clone(true);
	$newElem[0].className = "section list-item";


	//add initial children
	AddTimeSlotLoc($newElem.find(".time-slot-list-container"));

	//append to list
	$location.append($newElem);

}

function RemoveSection()
{
	var $list = $(this).closest(".section-list-container");
	$(this).closest(".section.list-item").remove();
	if ($list.children().length <= 0)
	{
		AddSectionLoc($list);
	}

	AutoSectionNames();
}


function CloneSection()
{
	$(this).closest(".section.list-item").after($(this).closest(".section.list-item").clone(true));
	AutoSectionNames();
	AutoTimeSlotNames();
}

/* === End Section Handlers === */



/* === Time Slot Handlers === */

//bind buttons
$(".time-slot-add").click(AddTimeSlot);
$(".time-slot-remove").click(RemoveTimeSlot);
$("button.day-button").click(DayButtonClick);
$(".time-start,.time-end").focusin(1, ShowTimePicker).click(1, ShowTimePicker);
$(".time-start,.time-end").focusout(HideTimePicker);
$(".time-slot-clone").click(CloneTimeSlot);

function AutoTimeSlotNames()
{
	var $sections = $(".section.list-item");
	for (var i = 0; i < $sections.length; i++)
	{
		var $timeSlotNames = $($sections[i]).find(".time-slot-name");
		for (var j = 0; j < $timeSlotNames.length; j++)
		{
			$($timeSlotNames[j]).attr("placeholder", "Class " + (j + 1));
		}
	}
	
	var $reserveSlots = $(".reserve.list-item");
	for (var i = 0; i < $reserveSlots.length; i++)
	{
		var $timeSlotNames = $($reserveSlots[i]).find(".time-slot-name");
		for (var j = 0; j < $timeSlotNames.length; j++)
		{
			$($timeSlotNames[j]).attr("placeholder", "Slot " + (j + 1));
		}
	}
}

function AddTimeSlot()
{
	AddTimeSlotLoc($(this).siblings(".time-slot-list-container"));
	
	AutoTimeSlotNames();
}
function AddTimeSlotLoc(location)
{
	//generate new element
	var $newElem = $TimeSlotTemplate.clone(true);
	$newElem[0].className = "time-slot list-item";


	//append to list
	location.append($newElem);
}

function RemoveTimeSlot()
{
	var $list = $(this).closest(".time-slot-list-container");
	$(this).closest(".time-slot.list-item").remove();
	if ($list.children().length <= 0)
	{
		AddTimeSlotLoc($list);
	}
	
	AutoTimeSlotNames();
}

function CloneTimeSlot()
{
	$(this).closest(".time-slot.list-item").after($(this).closest(".time-slot.list-item").clone(true));
	
	AutoTimeSlotNames();
}

function DayButtonClick()
{
	this.classList.toggle("active");
}

/* === End Time Slot Handlers === */



/* === Reserve Handlers === */

//bind buttons
$(".reserve-add").click(AddReserve);
$(".reserve-remove").click(RemoveReserve);
$(".reserve-clone").click(CloneReserve);

function AutoReserveNames()
{
	var $reserveNames = $(".reserve.list-item").find(".reserve-name");
	for (var i = 0; i < $reserveNames.length; i++)
	{
		$($reserveNames[i]).attr("placeholder", "Reserve Time " + (i + 1));
	}
}


function AddReserve()
{
	//generate new element
	var $newElem = $ReserveTemplate.clone(true);
	$newElem[0].className = "reserve list-item";

	$newElem.find(".colour").css("background", "#aaaaaa");


	//add initial children
	AddTimeSlotLoc($newElem.find(".time-slot-list-container"));

	//append to list
	$(".reserve-list-container").append($newElem);
	
	AutoReserveNames();
	AutoTimeSlotNames();
}

function RemoveReserve()
{
	//var $list = $(this).closest(".reserve-list-container");
	$(this).closest(".reserve.list-item").remove();

	AutoReserveNames();
}

function CloneReserve()
{
	var $newElem = $(this).closest(".reserve.list-item").clone(true);
	
	$newElem.find(".colour").css("background", "#aaaaaa");
	
	$(this).closest(".reserve.list-item").after($newElem);
	
	AutoReserveNames();
	AutoTimeSlotNames();
}

/* === End Reserve Handlers === */




/* === Schedule Handlers === */

//var ActiveSchedule = 0;
//$(".schedule-select-dec").click(DecrementActiveSchedule);
//$(".schedule-select-inc").click(IncrementActiveSchedule);

function DecrementActiveSchedule(event)
{
	var target = event.data;
	target.ActiveSchedule--;
	target.RefreshActiveScheduleVal();
	
	if (ValidSchedules.length) { DrawSchedule(target); }
}
function IncrementActiveSchedule(event)
{
	var target = event.data;
	target.ActiveSchedule++;
	target.RefreshActiveScheduleVal();
	
	if (ValidSchedules.length) { DrawSchedule(target); }
}

/*function RefreshActiveScheduleVal(target)
{
	target.ActiveSchedule = Math.max(Math.min(target.ActiveSchedule, ValidSchedules.length - 1), 0);
	target.$(".schedule-select-disp").html(Math.min(target.ActiveSchedule + 1, ValidSchedules.length) + "/" + ValidSchedules.length);
}*/


//var GridHeightOffset = 0;
//$(".schedule-content, .time-column").mousemove(UpdateMouseLine);
//$(".schedule-content, .time-column").mouseenter(function () { $(".mouse-line").removeClass("invisible"); GridHeightOffset = $(".schedule-content").offset().top; } );
//$(".schedule-content, .time-column").mouseleave(function () { $(".mouse-line").addClass("invisible"); });

function UpdateMouseLine(event)
{
	var target = event.data;
	target.$(".mouse-line").css("margin-top", event.clientY - target.GridHeightOffset + (document.documentElement.scrollTop || document.body.scrollTop) + "px");
	target.$(".mouse-line").css("right", "-2px").css("width", (target.$(".time-column").width() + target.$(".schedule-content").width() + 4)+ "px");
}

//$(".week-display-selector").click(SelectWeek);
var SelectedWeek = $(".week-display-selector.active").html();
function SelectWeek(event)
{
	var target = event.data;
	SelectedWeek = $(this).html();
	target.SelectedWeek = $(this).html();
	target.$(".week-display-selector").removeClass("active");
	$(this).addClass("active");
	DrawSchedule(target);
}

/*
var HoverTimer = 0;
var $HoverElem = 0;
$(".schedule-item-template").hover(StartHoverTimer, CancelHoverTimer);
//$("#schedule-tooltip").hover(ShowScheduleTooltip, HideScheduleTooltip);
function StartHoverTimer() 
{
	//console.log("timer");
	HoverTimer = setTimeout(ShowScheduleTooltip, 1000);
	$HoverElem = $(this);
}
function CancelHoverTimer() { clearTimeout(HoverTimer); HideScheduleTooltip(); }
function ShowScheduleTooltip()
{
	$("#schedule-tooltip").css("visibility", "visible");
	$("#schedule-tooltip").offset({ left: $HoverElem.offset().left + $HoverElem.outerWidth()/2, top:$HoverElem.offset().top + $HoverElem.outerHeight()/2 } );
	//console.log("Show Tooltip");
	$("#schedule-tooltip").stop().animate({ opacity: 1 }, 200, "linear", null);
}
function HideScheduleTooltip()
{
	//console.log("Hide Tooltip");
	$("#schedule-tooltip").stop().animate({ opacity: 0 }, 200, "linear", function () { 
			$("#schedule-tooltip").css("visibility", "hidden"); 
		});
}
*/

$("#compare-toggle").click(ToggleCompare)
function ToggleCompare()
{	
	if (!$("#compare-toggle").hasClass("active"))
	{
		$("#center-content").css("width", "auto");
		$("#main-content").css("grid-template-columns", "1fr 1fr 500px");
		var schedule2 = new HTMLSchedule($("#center-content"));
		ScheduleList.push(schedule2);
		DrawSchedule(schedule2);
	}
	else
	{
		$("#center-content").children().remove();
		$("#center-content").css("width", "0px");
		$("#main-content").css("grid-template-columns", "1fr auto 500px");
		ScheduleList.pop();
	}
	
	for (var i = 0; i < ScheduleList.length; i++)
	{
		ScheduleList[i].Resize({ data: ScheduleList[i]});
	}
	
	$("#compare-toggle").toggleClass("active");
}

function ExportSchedule(event)
{
	var target = event.data;

	ShowExportPopup(target);

	console.log("==============\n Export Schedule\n==============");
	
	if (ValidSchedules.length)
	{
		for (var j = 0; j < ValidSchedules[target.ActiveSchedule].length; j++)
		{
			var course = ValidSchedules[target.ActiveSchedule][j];
			
			console.log("Course:"+course.Name);
			console.log("Section:"+course.Section.Name);
			
			$Popup.children("#popup-content").append(course.Name + " " + course.Section.Name + "<br/>");
			
			for (var t = 0; t < course.Section.TimeSlotList.length; t++)
			{
				var timeslot = course.Section.TimeSlotList[t];
				console.log("TimeSlot:"+timeslot.toString());
				$Popup.children("#popup-content").append("&nbsp&nbsp&nbsp&nbsp" +timeslot.toString() + "<br/>");
			}
		}
	}
	
}

/* === End Schedule Handlers === */



/* === General Handlers === */

/* time picker */

$(".list-scroll").scroll(function () { $ActiveTimeBox.focusout(); } );

var $TimePicker = $("#time-picker")
$TimePicker.focusin(ShowTimePicker);
$TimePicker.focusout(HideTimePicker);
var $ActiveTimeBox = 0;
function ShowTimePicker(event)
{
	$TimePicker.removeClass("invisible");
	$TimePicker.addClass("visible");
	$TimePicker.scrollTop(0);
	if (event.data)
	{
		$ActiveTimeBox = $(this);
		//console.log("Spawn ["+val+"]");
		
		UpdateTimePickerPosition();
	}
}

function HideTimePicker(event)
{
	//ActiveTimeBox = 0;
	//console.log("Spawn ["+val+"]");
	$TimePicker.addClass("invisible");
	$TimePicker.removeClass("inv");
}

function UpdateTimePickerPosition()
{
	if ($ActiveTimeBox) 
	{
		$TimePicker.offset({ top: $ActiveTimeBox.position().top + $ActiveTimeBox[0].clientHeight + 1, left: $ActiveTimeBox.position().left });
	}
}

function PickTime()
{
	$ActiveTimeBox.val(this.innerHTML);
	$(this).focusout();
}

function InitTimePicker()
{
	for (var i = 0; i < (23-7)*2; i++)
	{
		$TimePicker.append("<div class=\"picker-elem\">" + ((Math.floor(i/2)+6)%12+1) + ":" + (i%2 ? "30" : "00") + ((i<=9?"am":"pm")) + "</div>");
	}
	$(".picker-elem").click(PickTime);
}

/* Popup */

var $Popup = $("#popup");
function ShowExportPopup(target)
{
	ClosePopup();
	$Popup.removeClass("hidden");
	$Popup.addClass("visible");
	$Popup.addClass("export-popup");
	
	UpdatePopupPos();
}

$("#popup-close").click(ClosePopup);
$Popup.focusout(ClosePopup);
function ClosePopup()
{
	$Popup.addClass("hidden");
	$Popup.removeClass("inv");
	$Popup.children("#popup-content").html("");
	$Popup.children("#popup-content").children().remove();
}

$(window).resize(UpdatePopupPos);
function UpdatePopupPos()
{
	var width = Math.min($(document).width() - 100, 300);
	var height = Math.min($(document).height() - 100, 300);
	$Popup.offset({ top: $(document).height() / 2 - height / 2, left: $(document).width() / 2 - width / 2 });
	//$Popup.offset({ top: "50%", left: "50%"});
	$Popup.css("width", width);
	$Popup.css("height", height);
	$Popup.focus();
}

$(".enable").click(EnableClick);
function EnableClick()
{
	$(this).toggleClass("checked")
}

/* === End General Handlers === */




/* === Init Items === */

//InitScheduleGrid();
var MainSchedule = new HTMLSchedule($("#left-content"));
var ScheduleList = [ MainSchedule ];

InitTimePicker();

AddCourse();

for (var i = 0; i < Colours.length; i++)
{
	//$("body").append("<div class=\"grid-item grid-slot\" style=\"position:absolute; left: 170px; top:" + (108 + i*112) + "px; background:" + Colours[i] + "80; border-color:" + Colours[i] + "; display:block; width:70px; height:45px; margin:5px;\"</div>");
}

/* === End Init Items === */
