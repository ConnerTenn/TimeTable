
var RequiredCourseList = [];
var CourseIndex = 0;
var ValidSchedules = [];

class BacktrackLine
{
	constructor()
	{
		this.Backtrack = function() {};
		this.Advance = function() {};
		this.Placer = {};
	}
	
	Do()
	{
		console.log("BacktrackLine::Do()");
		while (true)
		{
			var res = this.Placer.Place();
			if (res)
			{
				if (!this.Advance())
				{
					//Found solution
					console.log("BacktrackLine::Do() == Found Solution ==");
					return true;
				}				
			}
			else
			{
				if (!this.Backtrack())
				{
					//No solution
					console.log("BacktrackLine::Do() == No Solution ==");
					return false;
				}
			}
		}

	}
}

class BacktrackPlace
{
	constructor()
	{
		this.Advance = function() {};
		this.Reset = function() {};
	}
	
	Place()
	{
		console.log("BacktrackPlace::Place()");
		while (true)
		{
			var res = this.Advance();
			if (res === 1)
			{
				console.log("BacktrackPlace::Place() Success");
				//Success
				return true;
			}
			else if (res === 3)
			{
				//Out of bounds.
				console.log("BacktrackPlace::Place() Out of bounds");
				this.Reset();
				return false;
			}
			//else loop and try advance again
		}
	}
}


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
				
				timeslot.Start.Min = TimeToMin($(timeslots[t]).find(".time-start").val());
				timeslot.End.Min = TimeToMin($(timeslots[t]).find(".time-end").val());
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
	
	console.log("===============\n Found Courses\n===============");
	for (var i = 0; i < RequiredCourseList.length; i++)
	{
		console.log(RequiredCourseList[i].toString());
	}
}



function BacktrackCourse()
{
	console.log("BacktrackCourse()");
	
	CourseIndex--;
	return (CourseIndex >= 0 ? true : false);
}

function AdvanceCourse()
{
	console.log("AdvanceCourse() ");
	
	CourseIndex++;
	return (CourseIndex < RequiredCourseList.length ? true : false);
}

//Return: 1: Success  2: Fail  3: Out of Bounds
function AdvanceSection()
{
	console.log("AdvanceSection() ");
	
	var course = RequiredCourseList[CourseIndex];
	course.SelectedSection++;
	
	if (course.SelectedSection >= course.SectionList.length) 
	{
		return 3;
	}
	
	if (!course.Section.Valid()) { return 2; }
	
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
	console.log("ResetSection");
	
	RequiredCourseList[CourseIndex].SelectedSection = -1;
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

function MinToGridCoord(min)
{
	return min;
}

function DrawSchedule()
{
	console.log("==============\n Draw Courses\n==============");
	
	for (var i = 0; i < ValidSchedules.length; i++)
	{
		console.log("Schedule " + i + ":");
		for (var j = 0; j < ValidSchedules[i].length; j++)
		{
			console.log(ValidSchedules[i][j].toStringSimple());
		}
	}
}

function DoGenSchedule()
{	
	console.log("#####################\n#####################");
	RequiredCourseList = [];
	CourseIndex = 0;
	ValidSchedules = [];	
	ReadCourseData();
	GenerateSchedule();
	DrawSchedule();
}

$("button.genSchedule").click(DoGenSchedule);
