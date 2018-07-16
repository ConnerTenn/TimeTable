
#include "Schedule.h"
#include "Parser.h"

int main()
{
	std::cout << "## Start ##\n";
	
	HtmlParser parser;
	std::cout << "Open File:" << parser.OpenHtml("CIS 2430.html") << "\n";
	std::cout << "Find:" << parser.Find("<table summary=\"WSS.COURSE.SECTIONS\">") << " Pos:" << parser.GetPos() << "\n";
	std::cout << "Found: \"" << parser.ReadRaw(37) << "\"\n";
	parser.NavChild(); parser.NavChild(); //parser.NavNextSibling();
	std::cout << "Read: <"  << parser.GetName() << "  ";
	std::vector<HtmlLabel> labels = parser.GetLabels();
	for (int i = 0; i < (int)labels.size(); i++) { std::cout << labels[i].Label << "=\"" << labels[i].Content << "\" "; }
	std::cout << ">\n";
	
	parser.CloseHtml();
	
	std::cout << "## End ##\n";
	
}
