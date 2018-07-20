
#ifndef _SCHEDULE_H_
#define _SCHEDULE_H_

#include <iostream>
#include <cstring>
#include <string>
#include <vector>

#define MAX(a,b) ((a) > (b) ? (a) : (b))
#define MIN(a,b) ((a) < (b) ? (a) : (b))
#define ABS(a) ((a) < 0 ? -(a) : (a))
#define SMOD(a,b) ((b)+((a)%(b)))%(b)
//#define BITCOMP(var,bits,mask) ((var) & (bits) == (bits) ? true : false)
std::string MinSize(std::string str, int size, char fill = ' ');
std::string MaxSize(std::string str, int size);

typedef unsigned char u8;
typedef unsigned short u16;
typedef unsigned int u32;
typedef unsigned long u64;

struct Time
{
	int Hour = 0;
	int Min = 0;
	
	Time();
	Time(int hour, int min);
	void CalcOverflow();
	void CalcUnderflow();
	Time operator+(int min);
	Time operator+(Time other);
	Time operator-(int min);
	Time operator-(Time other);
	void operator=(Time other);
	bool operator==(Time other);
	bool operator>(Time other);
	bool operator>=(Time other);
	bool operator<(Time other);
	bool operator<=(Time other);
	std::string ToString();
};

struct TimeSlot
{
	u8 Days = 0;
	Time Start;
	Time End;
	
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

void PrintSchedule(Schedule schedule);

#endif
