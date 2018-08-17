
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
		//console.log("BacktrackLine::Do()");
		while (true)
		{
			var res = this.Placer.Place();
			if (res)
			{
				if (!this.Advance())
				{
					//Found solution
					//console.log("BacktrackLine::Do() == Found Solution ==");
					return true;
				}				
			}
			else
			{
				if (!this.Backtrack())
				{
					//No solution
					//console.log("BacktrackLine::Do() == No Solution ==");
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
		//console.log("BacktrackPlace::Place()");
		while (true)
		{
			var res = this.Advance();
			if (res === 1)
			{
				//Success
				//console.log("BacktrackPlace::Place() Success");
				return true;
			}
			else if (res === 3)
			{
				//Out of bounds.
				//console.log("BacktrackPlace::Place() Out of bounds");
				this.Reset();
				return false;
			}
			//else loop and try advance again
		}
	}
}


function ReadCourseData()
{
	var courses = $(".course-list-container").children();
	for (var c = 0; c < courses.length; c++)
	{
		var course = new Course();
		var sections = $(courses[c]).find(".section-list-container").children();
		
		course.Name = $(courses[c]).find(".course-name").val();
		if (course.Name.length === 0) { course.Name = $(courses[c]).find(".course-name").attr("placeholder"); }
		
		for (var s = 0; s < sections.length; s++)
		{
			var section = new Section();
			var timeslots = $(sections[s]).find(".time-slot-list-container").children();
			
			section.Name = $(sections[s]).find(".section-name").val();
			if (section.Name.length === 0) { section.Name = $(sections[s]).find(".section-name").attr("placeholder"); }
			
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
	//console.log("ResetSection");
	
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

function TimeToGridCoord(time)
{
	return (time.Hour-7)*4+2+Math.floor(time.Minutes/15);
}

var GridSlotTemplate = $(".grid-slot-template")[0];
function DrawSchedule()
{
	console.log("==============\n Draw Courses\n==============");
	var gridContainer = $(".grid-container");
	gridContainer.children(".grid-item.grid-slot").remove();
	
	for (var i = 0; i < Math.min(ValidSchedules.length, 1); i++)
	{
		console.log("Schedule " + i + ":");
		for (var j = 0; j < ValidSchedules[i].length; j++)
		{
			var course = ValidSchedules[i][j];
			console.log(course.toStringSimple());
			
			for (var t = 0; t < course.Section.TimeSlotList.length; t++)
			{
				var timeSlot = course.Section.TimeSlotList[t];
				
				for (var d = 0; d < 7; d++)
				{
					if ((timeSlot.Days >> d) & 1)
					{
						var newElem = GridSlotTemplate.cloneNode(true);
						newElem.className = "grid-item grid-slot";
						newElem.style = "grid-row:" + TimeToGridCoord(timeSlot.Start) + "/" + TimeToGridCoord(timeSlot.End) + "; grid-column:" + (2+d) + "/" + (2+d) + ";";
						$(newElem).find(".course-name").html(course.Name);
						$(newElem).find(".section-name").html(course.Section.Name);
						gridContainer.append(newElem);
					}
				}
			}
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

$("button.gen-schedule").click(DoGenSchedule);
