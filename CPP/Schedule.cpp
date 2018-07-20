
#include "Schedule.h"

std::string MinSize(std::string str, int size, char fill)
{
	return str + std::string(MAX(size-(int)str.size(), 0), fill);
}

std::string MaxSize(std::string str, int size)
{
	return str.substr(0, MIN(size, (int)str.size()));
}


Time::Time() {}
Time::Time(int hour, int min) { Hour=hour; Min=min; }
void Time::CalcOverflow() { Hour+=Min/60; Min=Min%60; Hour=Hour%24; }
void Time::CalcUnderflow() { if (Min<0) { Hour-=1+ABS(Min)/60; Min=SMOD(Min,60); } Hour=SMOD(Hour,24); }
Time Time::operator+(int min) { Time time(Hour, Min+min); time.CalcOverflow(); return time; }
Time Time::operator+(Time other) { Time time(Hour+other.Hour, Min+other.Min); time.CalcOverflow(); return time; }
Time Time::operator-(int min) { Time time(Hour, Min-min); time.CalcUnderflow(); return time; }
Time Time::operator-(Time other) { Time time(Hour-other.Hour, Min-other.Min); time.CalcUnderflow(); return time; }
void Time::operator=(Time other) { Hour=other.Hour; Min=other.Min; }
bool Time::operator==(Time other) { return Hour==other.Hour && Min==other.Min; }
bool Time::operator>(Time other) { if (Hour>other.Hour) { return true; } else if (Hour==other.Hour && Min > other.Min) { return true; } else { return false; } }
bool Time::operator>=(Time other) { if (Hour>other.Hour) { return true; } else if (Hour==other.Hour && Min >= other.Min) { return true; } else { return false; } }
bool Time::operator<(Time other) { return other>*this; }
bool Time::operator<=(Time other) { return other>=*this; }
std::string Time::ToString() { return std::to_string(Hour/10) + std::to_string(Hour%10) + ":" + std::to_string(Min/10) + std::to_string(Min%10); }

bool TimeSlot::Conflict(TimeSlot *other)
{
	//If they share the same day and if the times overlap
	return (Days & other->Days) && ((other->Start >= Start && other->Start <= End) || (other->End >= Start && other->End <= End));
}

bool Section::Conflict(Section *other)
{
	for (int i = 0; i < (int)TimeSlots.size(); i++)
	{
		for (int j = 0; j < (int)other->TimeSlots.size(); j++)
		{
			if (TimeSlots[i].Conflict(&(other->TimeSlots[j])))
			{
				return true;
			}
		}
	}
	return false;
}

/*bool Course::Conflict(Course *other)
{
	for (int i = 0; i < (int)Sections.size(); i++)
	{
		for (int j = 0; j < (int)other.Sections.size(); j++)
		{
			if (Sections[i].Conflict(other.Sections[j]))
			{
				return true;
			}
		}
	}
	return false;
}*/

Section *Course::GetSection()
{
	return &Sections[SelectedSection];
}

std::vector<Course> RequiredCourses;

std::vector<Schedule> ValidSchedules;

void BackTrack(Course *course, int &courseIndex, bool &done)
{
	std::cout << "Call Backtrack\n";
	
	//while curent section is out of range
	while (course->SelectedSection >= (int)course->Sections.size() && !done)
	{
		std::cout << "BackTrack\n";
		//reset to first section
		course->SelectedSection = 0;
		
		//remove last course from schedule
		//schedule.Courses.pop_back();
		
		//move to prevous course
		courseIndex--; 
		if (courseIndex < 0)
		{
			done = true;
		}
		else
		{
			course = &RequiredCourses[courseIndex];
			
			//move to next section
			course->SelectedSection++;
			
			std::cout << "Move to Next Section\n";
		}
	}
}

void GenerateSchedules()
{
	//Get Required courses
	
	ValidSchedules.clear();
	//ValidSchedules.push_back(Schedule());
	//Schedule workingSchedule;
	
	
	int courseIndex = 0;
	
	bool done = false;
	while (!done)
	{
		std::cout << "I:" << courseIndex << " N:" << RequiredCourses.size() << "\n";
		Course *course = &(RequiredCourses[courseIndex]);
		
		//While haven't selected all the courses
		while (courseIndex < (int)RequiredCourses.size() && !done)
		{
			//check if section fits existing schedule
			//if yes
				//add course
				//move to next course and start at first section
			//if no
				//move to next section
			
				//while curent section is out of range
					//reset to first section
					//remove last course from schedule
					//move to prevous course
					//move to next section
			
			
			course = &RequiredCourses[courseIndex];
			
			std::cout << "Adding Course: " << course->Code << " " << course->Name << "\n";
			std::cout << "Current Section: " << course->GetSection()->Number << "\n";
			
			//check if section fits existing schedule
			bool valid = true;
			for (int i= 0; i < courseIndex && valid; i++)
			{
				std::cout << "Compare Section Times:\n";
				std::cout << "    ";
				for (int k = 0; k < (int)course->GetSection()->TimeSlots.size(); k++)
				{
					for (int l = 0; l < 7; l++) { std::cout << ((course->GetSection()->TimeSlots[k].Days >> l) & 1 ? "SMTWTFS"[l] : '_') << " "; }
					std::cout << " " << course->GetSection()->TimeSlots[k].Start.ToString() << " - " << course->GetSection()->TimeSlots[k].End.ToString() << "    ";
				}
				std::cout << "\n    ";
				for (int k = 0; k < (int)RequiredCourses[i].GetSection()->TimeSlots.size(); k++)
				{
					for (int l = 0; l < 7; l++) { std::cout << ((RequiredCourses[i].GetSection()->TimeSlots[k].Days >> l) & 1 ? "SMTWTFS"[l] : '_') << " "; }
					std::cout << " " << RequiredCourses[i].GetSection()->TimeSlots[k].Start.ToString() << " - " << RequiredCourses[i].GetSection()->TimeSlots[k].End.ToString() << "    ";
				}
				std::cout << "\n";
				
				if (course->GetSection()->Conflict(RequiredCourses[i].GetSection()))
				{
					valid = false;
				}
			}
			
			if (valid)
			{
				std::cout << "Valid\n";
				//add course
				//Course newCourse;
				//newCourse.Sections.push_back(course->Sections[course->SelectedSection]);
				//schedule.Courses.push_back(newCourse);
				
				//move to next course and start at first section
				courseIndex++;
				if (courseIndex < (int)RequiredCourses.size())
				{
					RequiredCourses[courseIndex].SelectedSection = 0;
				}
			}
			else
			{
				std::cout << "Invalid\n";
				
				//move to next section
				course->SelectedSection++;
				BackTrack(course, courseIndex, done);
			}
			
			
		} //end while for adding courses
		
		std::cout << "Done Adding Courses\n";
		
		if (!done) 
		{ 
		
			std::cout << "Completed a Schedule\n";
			ValidSchedules.push_back(Schedule()); 
			
			//add courses to schedule
			for (int i = 0; i < (int)RequiredCourses.size() && !done; i++)
			{
				Course newCourse;
				newCourse.Name = RequiredCourses[i].Name;
				newCourse.Code = RequiredCourses[i].Code;
				newCourse.Sections.push_back(*(RequiredCourses[i].GetSection()));
				
				ValidSchedules.back().Courses.push_back(newCourse);
			}
		}
		
		//move to next section
		courseIndex--;
		course->SelectedSection++;
		BackTrack(course, courseIndex, done);
		
	}
	
	std::cout << "Done\n";
}

void PrintSchedule(Schedule schedule)
{
	//schedule.Courses
	std::cout << "|Time |  Sunday   |  Monday   |  Tuesday  | Wednesday | Thursday  |  Friday   |\n";
	std::cout << "|-----|-----------|-----------|-----------|-----------|-----------|-----------|\n";
	
	Time time;
	bool gap = 0;
	do
	{
		std::cout << "|" << (gap ? "-----" : time.ToString()) << "|";
		
		for (u8 day = 1; day < 0b01000000; day<<=1)
		{
			std::string daystr;
			for (int c = 0; c < (int)schedule.Courses.size(); c++)
			{
				Course &course = schedule.Courses[c];
				Section &section = course.Sections[0];
				for (int t = 0; t < (int)section.TimeSlots.size(); t++)
				{
					TimeSlot &timeSlot = section.TimeSlots[t];
					if (timeSlot.Days & day)
					{
						//if start now
						if (time==timeSlot.Start && !gap)
						{
							daystr = "###########";
						}
						//if end now
						else if (timeSlot.End-time < Time(0,30) && gap)
						{
							daystr = "###########";
						}
						//if first gap
						else if (time == timeSlot.Start  && gap)
						{
							daystr = "#" + MinSize(MaxSize(course.Code, 9), 9) + "#";
						}
						//if over now
						else if (timeSlot.Start < time && time <= timeSlot.End)
						{
							daystr = "#         #";
						}
						//no overlap
						else
						{
							//daystr = "           ";
						}
					}
				}
			}
				
			std::cout << MinSize(MaxSize(daystr, 11), 11, (gap ? '-' : ' ')) << "|";
		}
		
		
		std::cout << "\n";
		if (gap) {time=time+30;}
		gap = !gap;
	}
	while (time > Time() || gap);
}

