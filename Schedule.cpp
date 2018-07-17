
#include "Schedule.h"

bool TimeSlot::Conflict(TimeSlot *other)
{
	//If they share the same day and if the times overlap
	return Days & other->Days && (End >= other->Start || Start <= other->End);
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


void GenerateSchedules()
{
	//Get Required courses
	
	ValidSchedules.clear();
	ValidSchedules.push_back(Schedule());
	
	bool done = false;
	
	
	while (!done)
	{
		Schedule &schedule = ValidSchedules.back();
		
		int courseIndex = 0;
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
			
			
			Course *course = &RequiredCourses[courseIndex];
			
			//check if section fits existing schedule
			bool valid = true;
			for (int i= 0; i < courseIndex && valid; i++)
			{
				if (course->GetSection()->Conflict(RequiredCourses[i].GetSection()))
				{
					valid = false;
				}
			}
			
			if (valid)
			{
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
				//move to next section
				course->SelectedSection++;
				
				//while curent section is out of range
				while (course->SelectedSection >= (int)course->Sections.size() && !done)
				{
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
					}
				}
			}
			
			
		} //end while for adding courses
		
		//add courses to schedule
		for (int i = 0; i < (int)RequiredCourses.size() && !done; i++)
		{
			Course newCourse;
			newCourse.Sections.push_back(*(RequiredCourses[i].GetSection()));
			schedule.Courses.push_back(newCourse);
		}
		
	}
}

Course *GetCourseFromList(std::string code)
{
	for (int i = 0; i < (int)RequiredCourses.size(); i++)
	{
		if (RequiredCourses[i].Code == code) { return &RequiredCourses[i]; }
	}
	RequiredCourses.push_back(Course());
	return &(RequiredCourses.back());
}

