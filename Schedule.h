
#ifndef _SCHEDULE_H_
#define _SCHEDULE_H_

#include <string>
#include <vector>

typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef unsigned long u64;

struct TimeSlot
{
	u8 Days;
	int Start;
	int End;
	
	bool Conflict(TimeSlot *other);
};

struct Section
{
	std::string Number;
	std::vector <TimeSlot> TimeSlots;
	
	bool Conflict(Section *other);
};

struct Course
{
	std::string Code;
	
	int SelectedSection = 0;
	std::vector <Section> Sections;
	
	//bool Conflict(Course *other);
	Section *GetSection();
};

struct Schedule
{
	std::vector <Course> Courses;
};

extern std::vector<Course> RequiredCourses;

extern std::vector<Schedule> ValidSchedules;

void GenerateSchedules();

#endif
