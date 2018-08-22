
var RequiredCourseList = [];
var CourseIndex = 0;
var ValidSchedules = [];


function ReadTimeSlot(timeslots, section)
{
	for (var t = 0; t < timeslots.length; t++)
	{
		var $timeslot = $(timeslots[t]);
		var timeslot = new TimeSlot();

		timeslot.Name = $timeslot.find(".time-slot-name").val();
		timeslot.Week = $timeslot.find(".week-selector").val();
		timeslot.Start.Min = TimeToMin($timeslot.find(".time-start").val());
		timeslot.End.Min = TimeToMin($timeslot.find(".time-end").val());
		timeslot.Days = 0;
		for (var i = 0; i < 7; i++)
		{
			timeslot.Days += ($timeslot.find(".day-button." + DayNames[1][i])[0].classList.contains("active") ? 1 : 0) << i;
		}
		
		if (!timeslot.Valid()) { $timeslot.find(".time-slot-enable").prop("checked", false); }
		
		if ($timeslot.find(".time-slot-enable").prop("checked"))
		{
			section.TimeSlotList.push(timeslot);
		}
	}
}

function ReadCourseData()
{
	var $courses = $(".course-list-container").children();
	for (var c = 0; c < $courses.length; c++)
	{
		var $course = $($courses[c]);
		var course = new Course();
		var sections = $course.find(".section-list-container").children();
		
		course.Colour = $course.find(".colour").attr("colour");
		course.Name = $course.find(".course-name").val();
		if (course.Name.length === 0) { course.Name = $course.find(".course-name").attr("placeholder"); }
		
		for (var s = 0; s < sections.length; s++)
		{
			var $section = $(sections[s]);
			var section = new Section();
			var timeslots = $section.find(".time-slot-list-container").children();
			
			section.Name = $section.find(".section-name").val();
			if (section.Name.length === 0) { section.Name = $section.find(".section-name").attr("placeholder"); }
			
			ReadTimeSlot(timeslots, section);
			
			if (!section.Valid()) { $section.find(".section-enable").prop("checked", false); }
			
			if ($section.find(".section-enable").prop("checked"))
			{
				course.SectionList.push(section);
			}
		}
		
		if (!course.Valid()) { $course.find(".course-enable").prop("checked", false); }
		
		if ($course.find(".course-enable").prop("checked"))
		{
			RequiredCourseList.push(course);
		}
	}
	
	var $reserves = $(".reserve-list-container").children();
	for (var r = 0; r < $reserves.length; r++)
	{
		var $reserve = $($reserves[r]);
		var course = new Course();
		var section = new Section();
		var timeslots = $reserve.find(".time-slot-list-container").children();
		
		course.Colour = "#aaaaaa";
		course.Name = $reserve.find(".reserve-name").val();
		if (course.Name.length === 0) { course.Name = $reserve.find(".reserve-name").attr("placeholder"); }
		
		ReadTimeSlot(timeslots, section);

		course.SectionList.push(section);
		RequiredCourseList.push(course);
	}
	
	console.log("===============\n Found Courses\n===============");
	for (var i = 0; i < RequiredCourseList.length; i++)
	{
		console.log(RequiredCourseList[i].toString());
	}
}



function BacktrackCourse()
{
	//console.log("BacktrackCourse()");
	
	CourseIndex--;
	return (CourseIndex >= 0 ? true : false);
}

function AdvanceCourse()
{
	//console.log("AdvanceCourse() ");
	
	CourseIndex++;
	return (CourseIndex < RequiredCourseList.length ? true : false);
}

//Return: 1: Success  2: Fail  3: Out of Bounds
function AdvanceSection()
{
	//console.log("AdvanceSection() ");
	
	var course = RequiredCourseList[CourseIndex];
	if (!course) { return 3; }
	course.SelectedSection++;
	
	if (course.SelectedSection >= course.SectionList.length) 
	{
		return 3;
	}
	
	//if (!course.Section.Valid()) { return 2; }
	
	var conflict = false;
	for (var i = 0; i < CourseIndex; i++)
	{
		if (course.Section.Conflict(RequiredCourseList[i].Section))
		{
			conflict = true;
		}
	}
	
	if (conflict)
	{
		return 2;
	}
	
	return 1;
}

function ResetSection()
{
	//console.log("ResetSection");
	if (RequiredCourseList[CourseIndex]) 
	{
		RequiredCourseList[CourseIndex].SelectedSection = -1;
	}
}

function GenerateSchedule()
{	
	console.log("===================\n Generate Schedule\n===================");
	
	var courseGenerator = new BacktrackLine();
	courseGenerator.Backtrack = BacktrackCourse;
	courseGenerator.Advance = AdvanceCourse;
	courseGenerator.Placer = new BacktrackPlace();
	courseGenerator.Placer.Advance = AdvanceSection;
	courseGenerator.Placer.Reset = ResetSection;
	
	while (courseGenerator.Do())
	{
		ValidSchedules.push([]);
		var last = ValidSchedules[ValidSchedules.length - 1];
		
		for (var i = 0; i < RequiredCourseList.length; i++)
		{
			last.push(RequiredCourseList[i].CopySimple());
		}
		
		courseGenerator.Backtrack();
	}
}

function TimeToCoord(time)
{
	return (time.Hour - 7 + time.Minutes / 60) * 2 * 30;
}

function DrawSchedule(target)
{
	console.log("==============\n Draw Courses\n==============");
	console.log("Selected Week:\"" + SelectedWeek + "\"");
	var $scheduleContent = target.$(".schedule-content");
	$scheduleContent.find(".day-column").children(".day-container").children().remove();
	
	if (ValidSchedules.length)
	{		
		console.log("Schedule " + ActiveSchedule + ":");
		for (var j = 0; j < ValidSchedules[ActiveSchedule].length; j++)
		{
			var course = ValidSchedules[ActiveSchedule][j];
			console.log(course.toStringSimple());
			
			for (var t = 0; t < course.Section.TimeSlotList.length; t++)
			{
				var timeslot = course.Section.TimeSlotList[t];
				
				for (var d = 0; d < 7; d++)
				{
					if ((timeslot.Days >> d) & 1 && SelectedWeek == timeslot.Week)
					{
						var $newElem = $GridSlotTemplate.clone(true);
						$newElem[0].className = "schedule-item";
						//newElem.style = "grid-row:" + TimeToGridCoord(timeslot.Start) + "/" + TimeToGridCoord(timeslot.End) + "; grid-column:" + (2+d) + "/" + (2+d) + ";" + 
						//	"background:" + course.Colour + "80; border-color:" + course.Colour + ";";
						$newElem.css("background", course.Colour + "80").css("border-color", course.Colour).css("top", TimeToCoord(timeslot.Start)).css("height", TimeToCoord(timeslot.End) - TimeToCoord(timeslot.Start));
						$newElem.find(".course-name").html(course.Name);
						$newElem.find(".section-name").html(course.Section.Name); 
						$newElem.find(".time-slot-name").html(timeslot.Name);
						$scheduleContent.find(".day-column[column="+(d+1)+"]").children(".day-container").append($newElem);
					}
				}
			}
		}
	}
}

function DoGenSchedule()
{
	console.time("Do Gen Schedule Time");
	console.log("#####################\n#####################");
	
	RequiredCourseList = [];
	CourseIndex = 0;
	ValidSchedules = [];	
	
	ReadCourseData();
	GenerateSchedule();

	ActiveSchedule = 0;
	RefreshActiveScheduleVal(Schedule);
	
	DrawSchedule(Schedule);
	
	console.timeEnd("Do Gen Schedule Time");
}

$("button.gen-schedule").click(DoGenSchedule);
