

#include "Parser.h"


std::string RemPrePostWhite(std::string str)
{
	int start = 0, stop = str.size() - 1;
	while (str[start] == ' ' || str[start] == '\n' || str[start] == '\t') { start++; }
	while (str[stop] == ' ' || str[stop] == '\n' || str[stop] == '\t') { stop--; }
	return str.substr(start, stop - start);
}

void ParseSection(HtmlParser parser)
{
	
	HtmlParser sectionParser = parser;
	sectionParser.NavToKey("windowIdx");
	std::cout << sectionParser.GetContent() << "\n";
	
	sectionParser.NavToKey("SEC_TERM_");
	std::cout << sectionParser.GetContent() << "\n";
	
	sectionParser.NavToKey("LIST_VAR2_");
	std::cout << sectionParser.GetContent() << "\n";
	
	sectionParser.NavToKey("SEC_SHORT_TITLE left "); sectionParser.NavChild(); sectionParser.NavChild();
	std::cout << sectionParser.GetContent() << "\n";
	
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
			contentParser.NavChild();
			std::cout << contentParser.GetContent() << "\n";
			contentParser.NavNextSibling();
			std::cout << "   " << contentParser.GetContent() << "\n";
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

