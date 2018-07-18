
#include "Schedule.h"
#include "Parser.h"

int main()
{
	std::cout << "## Start ##\n";
	
	//Parse({});
	
	for (int i = 0; i < (int)RequiredCourses.size(); i++)
	{
		for (int j = 0; j < (int)RequiredCourses[i].Sections.size(); j++)
		{
			std::cout << RequiredCourses[i].Code << " " << RequiredCourses[i].Sections[j].Number << " " << RequiredCourses[i].Name << "\n";
			for (int k = 0; k < (int)RequiredCourses[i].Sections[j].TimeSlots.size(); k++)
			{
				for (int l = 0; l < 7; l++) 
				{
					std::cout << ((RequiredCourses[i].Sections[j].TimeSlots[k].Days >> l) & 1 ? "SMTWTFS"[l] : '_');
				}
				std::cout << " " << RequiredCourses[i].Sections[j].TimeSlots[k].Start.ToString() << " - " << RequiredCourses[i].Sections[j].TimeSlots[k].End.ToString() << "\n";
			}
			std::cout << "\n";
		}
	}
	
	std::cout << (Time(10,30)-Time(12,00)).ToString() << "\n";
	Schedule schedule;
	{
		Course course; Section section; TimeSlot timeSlot;
		
		timeSlot.Days = 0b00101010; timeSlot.Start = Time(8,30); timeSlot.End = Time(10,30);
		section.TimeSlots.push_back(timeSlot);
		timeSlot.Days = 0b00010100; timeSlot.Start = Time(12,00); timeSlot.End = Time(13,30);
		section.TimeSlots.push_back(timeSlot);
		
		section.Number = "Num";
		course.Sections.push_back(section);
		
		course.Code = "CIS*2140"; course.Name = "Name";
		schedule.Courses.push_back(course);
	}
	{
		Course course; Section section; TimeSlot timeSlot;
		
		timeSlot.Days = 0b00000010; timeSlot.Start = Time(13,00); timeSlot.End = Time(14,30);
		section.TimeSlots.push_back(timeSlot);
		timeSlot.Days = 0b00010100; timeSlot.Start = Time(15,30); timeSlot.End = Time(17,00);
		section.TimeSlots.push_back(timeSlot);
		
		section.Number = "Num";
		course.Sections.push_back(section);
		
		course.Code = "ENGG*2100"; course.Name = "Name";
		schedule.Courses.push_back(course);
	}
	PrintSchedule(schedule);
	
	std::cout << "## End ##\n";
	
}
