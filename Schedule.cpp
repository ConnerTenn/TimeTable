
#include "Schedule.h"

bool TimeSlot::Conflict(TimeSlot &other)
{
	//If they share the same day and if the times overlap
	return Days & other.Days && (End >= other.Start || Start <= other.End);
}

bool Section::Conflict(Section &other)
{
	for (int i = 0; i < (int)TimeSlots.size(); i++)
	{
		for (int j = 0; j < (int)other.TimeSlots.size(); j++)
		{
			if (TimeSlots[i].Conflict(other.TimeSlots[j]))
			{
				return true;
			}
		}
	}
	return false;
}

bool Course::Conflict(Course &other)
{
	/*for (int i = 0; i < (int)Sections.size(); i++)
	{
		for (int j = 0; j < (int)other.Sections.size(); j++)
		{
			if (Sections[i].Conflict(other.Sections[j]))
			{
				return true;
			}
		}
	}*/
	return false;
}

std::vector<Course> RequiredCourses;

std::vector<Schedule> ValidSchedules;


void GenerateSchedules()
{
	//Get Required courses
	
	ValidSchedules.clear();
	ValidSchedules.push_back(Schedule());
	
	int courseIndex = 0;
	bool done = false;
	
	
	while (!done)
	{
		Schedule &schedule = ValidSchedules.back();
		
		//While haven't selected all the courses
		while (ValidSchedules.back().Courses.size() < RequiredCourses.size())
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
			
			
			Course *course = &RequiredCourses[courseIndex];
			
			//check if section fits existing schedule
			bool valid = true;
			for (int i= 0; i < (int)schedule.Courses.size() && valid; i++)
			{
				if (course->Sections[course->SelectedIndex].Conflict(schedule.Courses[i].Sections[0]))
				{
					valid = false;
				}
			}
			
			if (valid)
			{
				//add course
				Course newCourse;
				newCourse.Sections.push_back(course->Sections[course->SelectedIndex]);
				schedule.Courses.push_back(newCourse);
				
				//move to next course and start at first section
				courseIndex++;
				RequiredCourses[courseIndex].SelectedIndex = 0;
			}
			else
			{
				//move to next section
				course->SelectedIndex++;
			}
			
			//while curent section is out of range
			while (course->SelectedIndex >= course->Sections.size())
			{
				//reset to first section
				course->SelectedIndex = 0;
				
				//remove last course from schedule
				schedule.Courses.pop_back();
				//move to prevous course
				courseIndex--;
				course = &RequiredCourses[courseIndex];
				
				//move to next section
				course->SelectedIndex++;
			}
		}
	}
}
