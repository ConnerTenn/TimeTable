

#include "Parser.h"


std::string RemPrePostWhite(std::string str)
{
	int start = 0, stop = str.size() - 1;
	while (str[start] == ' ' || str[start] == '\n' || str[start] == '\t') { start++; }
	while (str[stop] == ' ' || str[stop] == '\n' || str[stop] == '\t') { stop--; }
	return str.substr(start, stop - start);
}



void GetCourseInfo(std::string src, std::string *code, std::string *name, std::string *sectionNumber)
{
	int i = 0;
	while (src[i] != ' ') { *code += src[i]; i++; }
	i++;
	while (src[i] != ' ') { *sectionNumber += src[i]; i++; }
	i++;
	while (i < (int)src.size()) { *name += src[i]; i++; }
}

TimeSlot GetTimeSlot(std::string days, std::string times)
{
	TimeSlot timeSlot;
	if (days.find("Sun") != std::string::npos) { timeSlot.Days |=   0b00000001; }
	if (days.find("Mon") != std::string::npos) { timeSlot.Days |=   0b00000010; }
	if (days.find("Tues") != std::string::npos) { timeSlot.Days |=  0b00000100; }
	if (days.find("Wed") != std::string::npos) { timeSlot.Days |=   0b00001000; }
	if (days.find("Thurs") != std::string::npos) { timeSlot.Days |= 0b00010000; }
	if (days.find("Fri") != std::string::npos) { timeSlot.Days |=   0b00100000; }
	if (days.find("Sat") != std::string::npos) { timeSlot.Days |=   0b01000000; }
	
	timeSlot.Start.Hour += 10*(times[0] - '0');
	timeSlot.Start.Hour += (times[1] - '0');
	timeSlot.Start.Min += 10*(times[3] - '0');
	timeSlot.Start.Min += (times[4] - '0');
	timeSlot.Start.Hour += (times[5] == 'P' ? 12 : 0);
	
	timeSlot.End.Hour += 10*(times[10] - '0');
	timeSlot.End.Hour += (times[11] - '0');
	timeSlot.End.Min += 10*(times[13] - '0');
	timeSlot.End.Min += (times[14] - '0');
	timeSlot.End.Hour += (times[15] == 'P' ? 12 : 0);
	
	return timeSlot;
}


void ParseSection(HtmlParser parser)
{
	Course *course;
	Section section;
	std::string code, name, sectionNumber; 
		
	HtmlParser sectionParser = parser;
	sectionParser.NavToKey("windowIdx");
	std::cout << sectionParser.GetContent() << "\n";
	
	sectionParser.NavToKey("SEC_TERM_");
	std::cout << sectionParser.GetContent() << "\n";
	
	sectionParser.NavToKey("LIST_VAR2_");
	std::cout << sectionParser.GetContent() << "\n";
	
	sectionParser.NavToKey("SEC_SHORT_TITLE left "); sectionParser.NavChild(); sectionParser.NavChild();
	//std::cout << sectionParser.GetContent() << "\n";
	GetCourseInfo(sectionParser.GetContent(), &code, &name, &sectionNumber);
	std::cout << code << " " << sectionNumber << " " << name << "\n";
	course = GetCourseFromList(code);
	course->Code = code;
	course->Name = name;
	section.Number = sectionNumber;
	
	sectionParser.NavToKey("SEC_LOCATION left "); sectionParser.NavChild(); sectionParser.NavChild();
	std::cout << sectionParser.GetContent() << "\n";
	
	sectionParser.NavToKey("SEC_MEETING_INFO left "); sectionParser.NavChild(); sectionParser.NavChild(); sectionParser.NavNextSibling(); 
	while (sectionParser.NavNextSibling())
	{
		HtmlParser contentParser = sectionParser;
		bool valid = false;
		{ std::vector<HtmlLabel> labels = contentParser.GetLabels(); for (int i = 0; i < (int)labels.size(); i++) { if (labels[i].Content.find("meet ") != std::string::npos) { valid = true; } } }
		if (valid)
		{
			std::string days, times;
			contentParser.NavChild();
			std::cout << contentParser.GetContent() << "\n";
			days = contentParser.GetContent();
			contentParser.NavNextSibling();
			std::cout << "   " << contentParser.GetContent() << "\n";
			times = contentParser.GetContent();
			
			section.TimeSlots.push_back(GetTimeSlot(days, times));
			
			contentParser.NavNextSibling(); 
			if (contentParser.NavChild())
			{
				std::cout << "   " << contentParser.GetContent();
				contentParser.Alighn(-2);
				std::cout << " " << RemPrePostWhite(contentParser.GetContent()) << "\n";
			}
			else
			{
				std::cout << "   " << contentParser.GetContent() << "\n";
			}
		}
	}

	sectionParser.NavToKey("SEC_FACULTY_INFO_"); 
	std::cout << sectionParser.GetContent() << "\n";
	
	sectionParser.NavToKey("LIST_VAR3 left "); sectionParser.NavChild(); sectionParser.NavChild();
	std::cout << sectionParser.GetContent() << "\n";
	
	course->Sections.push_back(section);
}

void Parse(std::vector<std::string> CourseCodes)
{
	HtmlParser parser;
	
	parser.OpenHtml("CIS 0000.html");
	parser.Find("<table summary=\"WSS.COURSE.SECTIONS\">");
	
	parser.NavChild(); parser.NavChild(); 
	
	while (parser.NavNextSibling())
	{
		ParseSection(parser);	
		std::cout << "\n\n";
	}
	
	
	parser.CloseHtml();
}

