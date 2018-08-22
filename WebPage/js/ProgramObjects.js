
var $CourseTemplate = $(".course-template");
var $SectionTemplate = $(".section-template");
var $TimeSlotTemplate = $(".time-slot-template");
var $ReserveTemplate = $(".reserve-template");
var $GridSlotTemplate = $(".schedule-item-template");

var Colours = [["#b58900", 0], ["#cb4b16", 0], ["#dc322f", 0], ["#d33682", 0], ["#6c71c4", 0], ["#268bd2", 0], ["#2aa198", 0], ["#859900", 0]];
var DayNames = [["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"], ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]];

function GetColour()
{
	var min = Colours[0][1];
	//find minimum count for used colours
	for (var i = 1; i < Colours.length; i++)
	{
		min = (Colours[i][1] < min ? Colours[i][1] : min);
	}
	//save colours that are minimally used
	var colours = [];
	for (var i = 0; i < Colours.length; i++)
	{
		if (Colours[i][1] == min) { colours.push([Colours[i][0], i]); }
	}
	//select colour
	var selected = Rand(0, colours.length - 1);
	//increment use counter for selected colour
	Colours[colours[selected][1]][1]++;
	
	return colours[selected][0];
	
	
}

function Rand(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
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
	var hour = 0, min = 0, off = 0;
	if (time[1] == ":")
	{
	}
	else if (time[2] == ":")
	{
		off = 1;
	}
	else
	{
		return NaN;
	}

	hour = parseInt(time.substring(0, 1+off));
	if (hour > 12) { return NaN; }
	min = parseInt(time.substring(2+off, 4+off));
	hour += (time[4+off].toLowerCase() == 'p' && hour != 12 ? 12 : 0);
	if (hour < 7) { return NaN; }
	if (time[5+off].toLowerCase() != 'm' && time[5+off].toLowerCase() != 'm') { return NaN; }

	if (isNaN(hour) || isNaN(min)) { return NaN; }
	return hour * 60 + min;
}


class Time
{
	constructor()
	{
		this.Min = 0;
	}
	
	get Minutes()
	{
		return this.Min % 60;
	}
	
	get Hour()
	{
		return Math.floor(this.Min / 60);
	}
	
	Valid()
	{
		return (0 <= this.Min && this.Min < 1440 ? true : false);
	}
}

class TimeSlot
{
	constructor()
	{
		this.Start = new Time;
		this.End = new Time;
		this.Days = 0b0000000; //Sat Fri Thurs Wed Tues Mon Sun
		this.Name = "";
		//this.Instructor = "";
		//this.Classroom = "";
		this.Week = "";
	}
	
	Conflict(other)
	{
		return (this.Week == other.Week) && (this.Days & other.Days) && ((other.Start.Min >= this.Start.Min && other.Start.Min < this.End.Min) || (other.End.Min > this.Start.Min && other.End.Min <= this.End.Min));
	}
	
	Copy()
	{
		var newTimeSlot = new TimeSlot();
		newTimeSlot.Name = this.Name;
		newTimeSlot.Week = this.Week;
		newTimeSlot.Start.Min = this.Start.Min;
		newTimeSlot.End.Min = this.End.Min;
		newTimeSlot.Days = this.Days;
		return newTimeSlot;
	}
	
	Valid()
	{
		if (!this.Days || !this.Start.Valid() || !this.End.Valid) { return false; }
		return true;
	}
	
	toString()
	{
		var outStr = "";
		
		outStr += "\"" + this.Name + "\" \"" + this.Week + "\" ";
		for (var i = 0; i < 7; i++)
		{
			if (this.Days & (1 << i)) { outStr += DayNames[1][i] + " "; }
		}		
		outStr += this.Start.Hour + ":" + this.Start.Minutes + "-" + this.End.Hour + ":" + this.End.Minutes;
		
		return outStr;
	}
}

class Section 
{
	constructor()
	{
		this.Name = "";
		this.TimeSlotList = [];
	}
	
	Conflict(other)
	{
		for (var i = 0; i < this.TimeSlotList.length; i++)
		{
			for (var j = 0; j < other.TimeSlotList.length; j++)
			{
				if (this.TimeSlotList[i].Conflict(other.TimeSlotList[j]))
				{
					return true;
				}
			}
		}
		return false;
	}
	
	Valid()
	{
		for (var i = 0; i < this.TimeSlotList.length; i++)
		{
			if (this.TimeSlotList[i].Valid()) { return true; }
		}
		return false;
	}
	
	Copy()
	{
		var newSection = new Section();
		newSection.Name = this.Name;
		newSection.Instructor = this.Instructor;
		newSection.Classroom = this.Classroom;
		for (var i = 0; i < this.TimeSlotList.length; i++)
		{
			newSection.TimeSlotList.push(this.TimeSlotList[i].Copy());
		}
		return newSection;
	}
	
	toString()
	{
		var outStr = "";
		
		outStr += this.Name + " ";
		for (var i = 0; i < this.TimeSlotList.length; i++)
		{
			outStr += "[" + this.TimeSlotList[i] + "] ";
		}
		
		return outStr;
	}
}

class Course
{
	constructor()
	{
		this.Name = "";
		this.SectionList = [];
		this.SelectedSection = -1;
		this.Colour = 0;
	}
	
	get Section()
	{
		return this.SectionList[this.SelectedSection];
	}
	
	Valid()
	{
		for (var i = 0; i < this.SectionList.length; i++)
		{
			if (this.SectionList[i].Valid()) { return true; }
		}
		return false;
	}
	
	CopySimple()
	{
		var newCourse = new Course();
		newCourse.Name = this.Name;
		newCourse.SectionList.push(this.Section.Copy());
		newCourse.SelectedSection = 0;
		newCourse.Colour = this.Colour;
		return newCourse;
	}
	
	toString()
	{
		var outStr = "";
		outStr += this.Name + "\n";
		for (var i = 0; i < this.SectionList.length; i++)
	 	{
			outStr += "{ " + this.SectionList[i] + "}\n";
		}
		return outStr;
	}
	
	toStringSimple()
	{
		return this.Name + " {" + this.Section + "}";
	}
}

class BacktrackLine
{
	constructor()
	{
		this.Backtrack = function () { };
		this.Advance = function () { };
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
		this.Advance = function () { };
		this.Reset = function () { };
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

class HTMLSchedule
{
	constructor($root)
	{
		this.$Root = $root;
		this.ActiveSchedule = 0;
		this.SelectedWeek = this.$(".week-display-selector.active").html();
		this.GridHeightOffset = 0;
		
		this.InitScheduleGrid();
		this.BindEvents();
	}
	
	$(q)
	{
		return this.$Root.find(q);
	}
	
	InitScheduleGrid()
	{
		this.UpdateScheduleTimes(this);
		
		this.UpdateScheduleNames(this);
		for (var i = 0; i < 7; i++)
		{
			this.$(".mouse-line").before("<div class='day-column' column='" + (i+1) + "'><div class='day-container'></div></div>");
		}
	}
	
	UpdateScheduleTimes(target)
	{
		target.$(".time-column").children(":not(:first)").remove();
		target.$(".time-divider-container").children().remove();
		
		var shrink = target.$(".schedule-header").width() < 450;
		for (var i = 1; i < (23 - 7) * 2; i++)
		{
			var timestr;
			if (shrink)
			{
				timestr = (i % 2 ? ":30" : ((Math.floor(i / 2) + 6) % 12 + 1) + ((i <= 9 ? "am" : "pm")));
			}
			else
			{
				timestr = ((Math.floor(i / 2) + 6) % 12 + 1) + ":" + (i % 2 ? "30" : "00") + ((i <= 9 ? "am" : "pm"));
			}
			
			target.$(".time-column").append("<div class='time-label-spacer'><div class='time-label'>" + timestr + "</div></div>");
			target.$(".time-divider-container").append("<div class='time-divider'></div>");
		}

	}
	
	UpdateScheduleNames(target)
	{
		target.$(".schedule-header").children().remove();
		var set = (target.$(".schedule-header").width() < 660 ? 1 : 0);
		for (var i = 0; i < 7; i++)
		{
			target.$(".schedule-header").append("<div>" + DayNames[set][i] + "</div>");
		}
	}
	
	Resize(event)
	{
		var target = event.data
		target.UpdateScheduleTimes(target);
		target.UpdateScheduleNames(target);
	}
	
	BindEvents()
	{
		this.$(".schedule-select-dec").click(this, DecrementActiveSchedule);
		this.$(".schedule-select-inc").click(this, IncrementActiveSchedule);
		
		this.$(".week-display-selector").click(this, SelectWeek);
		
		this.$(".schedule-content, .time-column").mousemove(this, UpdateMouseLine);
		this.$(".schedule-content, .time-column").mouseenter(this, function (event) { var target = event.data; target.$(".mouse-line").removeClass("invisible"); target.GridHeightOffset = target.$(".schedule-content").offset().top; });
		this.$(".schedule-content, .time-column").mouseleave(this, function (event) { event.data.$(".mouse-line").addClass("invisible"); });
		
		$(window).resize(this, this.Resize);
	}
}

