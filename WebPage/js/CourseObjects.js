
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
}

var DayNames = ["sun", "mon", "tue", "wed", "thu", "fri", "sat", "sun"];
class TimeSlot
{
	constructor()
	{
		this.Start = new Time;
		this.End = new Time;
		this.Days = 0b0000000; //Sat Fri Thurs Wed Tues Mon Sun
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
		this.Instructor = "";
		this.Classroom = "";
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
		return this.Name + " " + this.Section;
	}
}

