
function IsLetter(c)
{
	return c.length === 1 && c.match(/[a-z]/i);
}

function IsNumber(c)
{
	return c >= '0' && c <= '9';
}


function TimeToMin(time)
{
	time = time.replace(/\s+/g, ''); //remove spaces
	var hour = 0, min = 0;
	if (time[1] == ":")
	{
		hour = time[0] - '0';
		min = parseInt(time.substring(2, 4));
		hour += (time[4].toLowerCase() == 'a' ? 0 : 12);
	}
	else if (time[2] == ":")
	{
		hour = parseInt(time.substring(0,2));
		if (hour > 12) { return NaN; }
		min = parseInt(time.substring(3,5));
		hour += (time[5].toLowerCase() == 'a' ? 0 : 12);
	}
	else
	{
		return NaN;
	}
	
	if (isNaN(hour) || isNaN(min)) {return NaN; }
	return hour * 60 + min;
}

var RequiredCourseList = [];

function ReadCourseData()
{
	var courses = $(".CourseListContainer").children();
	for (var c = 0; c < courses.length; c++)
	{
		var course = new Course();
		var sections = $(courses[c]).find(".SectionListContainer").children();
		
		course.Name = $(courses[c]).find(".course-name").val();
		
		for (var s = 0; s < sections.length; s++)
		{
			var section = new Section();
			var timeslots = $(sections[s]).find(".TimeSlotListContainer").children();
			
			section.Name = $(sections[s]).find(".section-name").val();
			
			for (var t = 0; t < timeslots.length; t++)
			{
				var timeslot = new TimeSlot();
				
				timeslot.Start = TimeToMin($(timeslots[t]).find(".time-start").val());
				timeslot.End = TimeToMin($(timeslots[t]).find(".time-end").val());
				timeslot.Days = 0;
				for (var i = 0; i < 7; i++)
				{
					timeslot.Days += ($(timeslots[t]).find(".day-button." + DayNames[i])[0].classList.contains("active") ? 1 : 0) << i;
				}
				
				section.TimeSlotList.push(timeslot);
			}
			
			course.SectionList.push(section);
		}
		
		RequiredCourseList.push(course);
	}
}

function GenerateSchedule()
{
	console.log();
	for (var c = 0; c < RequiredCourseList.length; c++)
	{
		var course = RequiredCourseList[c];
		for (var s = 0; s < course.SectionList.length; s++)
		{
			var section = course.SectionList[s];
			for (var t = 0; t < section.TimeSlotList.length; t++)
			{
				var timeslot = section.TimeSlotList[t];
				
				var days = "";
				for (var i = 0; i < 7; i++)
				{
					if (timeslot.Days & (1 << i)) { days = days + DayNames[i] + " "; }
				}
				console.log("Course:" + course.Name + "  Section:" + section.Name + " " + days + " " + timeslot.Start + "-" + timeslot.End);
			}
		}
	}
}

function DrawSchedule()
{
	
}

function DoGenSchedule()
{
	ReadCourseData();
	GenerateSchedule();
	DrawSchedule();
}

$("button.genSchedule").click(DoGenSchedule);
