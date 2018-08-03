
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

class TimeSlot
{
	constructor()
	{
		this.Start = new Time;
		this.End = new Time;
		this.Days = 0b0000000; //Sat Fri Thurs Wed Tues Mon Sun
	}
	
	Consflict(other)
	{
		return (this.Days & other.Days) && ((other.Start.Min >= this.Start.Min && other.Start.Min <= this.End.Min) || (other.End.Min >= this.Start.Min && Other.End.Min <= this.End.Min));
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
			for (var j = 0; j < other.TimeSlots.length; j++)
			{
				if (this.TimeSlotList[i].Conflict(other.TimeSlotList[j]))
				{
					return true;
				}
			}
		}
		return false;
	}
}

class Course
{
	constructor()
	{
		this.Name = "";
		this.SectionList = [];
	}
}

