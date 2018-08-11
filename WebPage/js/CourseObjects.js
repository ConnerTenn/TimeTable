
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

var DayNames = ["sun", "mon", "tue", "wed", "thu", "fri", "sat", "sun"];
class TimeSlot
{
	constructor()
	{
		this.Start = new Time;
		this.End = new Time;
		this.Days = 0b0000000; //Sat Fri Thurs Wed Tues Mon Sun
		this.Instructor = "";
		this.Classroom = "";
	}
	
	Conflict(other)
	{
		return (this.Days & other.Days) && ((other.Start.Min >= this.Start.Min && other.Start.Min <= this.End.Min) || (other.End.Min >= this.Start.Min && Other.End.Min <= this.End.Min));
	}
	
	Copy()
	{
		var newTimeSlot = new TimeSlot();
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
		
		for (var i = 0; i < 7; i++)
		{
			if (this.Days & (1 << i)) { outStr += DayNames[i] + " "; }
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
			if (!this.TimeSlotList[i].Valid()) { return false; }
		}
		return true;
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
	}
	
	get Section()
	{
		return this.SectionList[this.SelectedSection];
	}
	
	CopySimple()
	{
		var newCourse = new Course();
		newCourse.Name = this.Name;
		newCourse.SectionList.push(this.Section.Copy());
		newCourse.SelectedSection = 0;
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

