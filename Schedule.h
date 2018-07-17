
#ifndef _SCHEDULE_H_
#define _SCHEDULE_H_

#include <iostream>
#include <cstring>
#include <string>
#include <vector>

#define MAX(a,b) ((a) > (b) ? (a) : (b))
#define MIN(a,b) ((a) < (b) ? (a) : (b))
//#define BITCOMP(var,bits,mask) ((var) & (bits) == (bits) ? true : false)

typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef unsigned long u64;

struct TimeSlot
{
	u8 Days = 0;
	int Start = 0;
	int End = 0;
	
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
	std::string Name;
	
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

Course *GetCourseFromList(std::string code);

#endif
