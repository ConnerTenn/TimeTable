
#include "Schedule.h"
#include "Parser.h"

int main()
{
	std::cout << "## Start ##\n";
	
	Parse({});
	
	for (int i = 0; i < (int)RequiredCourses.size(); i++)
	{
		for (int j = 0; j < (int)RequiredCourses[i].Sections.size(); j++)
		{
			std::cout << RequiredCourses[i].Code << " " << RequiredCourses[i].Sections[j].Number << " " << RequiredCourses[i].Name << "\n";
			for (int k = 0; k < (int)RequiredCourses[i].Sections[j].TimeSlots.size(); k++)
			{
				for (int l = 0; l < 7; l++) 
				{
					std::cout << ((RequiredCourses[i].Sections[j].TimeSlots[k].Days >> l) & 1 ? "MTWTFSS"[l] : '_');
				}
				std::cout << " " << RequiredCourses[i].Sections[j].TimeSlots[k].Start << " - " << RequiredCourses[i].Sections[j].TimeSlots[k].End << "\n";
			}
			std::cout << "\n";
		}
	}
	
	std::cout << "## End ##\n";
	
}
