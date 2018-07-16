
#include "Schedule.h"
#include "Parser.h"

int main()
{
	std::cout << "## Start ##\n";
	
	HtmlParser parser;
	std::cout << "Open File:" << parser.OpenHtml("CIS 2430.html") << "\n";
	std::cout << "Find:" << parser.Find("<table summary=\"WSS.COURSE.SECTIONS\">") << " Pos:" << parser.GetPos() << "\n";
	std::cout << "Found: \"" << parser.ReadRaw(37) << "\"\n";
	parser.NavChild(); parser.NavChild(); parser.NavChild();
	std::cout << "Found: \"" << parser.ReadRaw(37) << "\"\n";
	
	parser.CloseHtml();
	
	std::cout << "## End ##\n";
	
}
