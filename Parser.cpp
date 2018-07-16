
#include "Parser.h"

HtmlParser::HtmlParser() { }

HtmlParser::HtmlParser(HtmlParser &other, bool duplicate)
{
	if (!duplicate) 
	{ 
		Html = other.Html; 
		Pos = other.Pos; 
		Length = other.Length; 
	}
	else
	{
		Length = other.Length;
		Html = new char[Length];
		memcpy(Html, other.Html, Length);
	}
}

HtmlParser::~HtmlParser()
{
	//CloseHtml();
}

void HtmlParser::operator=(HtmlParser &other)
{
	Html = other.Html; 
	Pos = other.Pos; 
	Length = other.Length; 
}


void HtmlParser::Traverse(HtmlEvents stopCondition)
{	
	u8 state = S_Head;
	int level = 0, sibling = 0;
	std::string name;
	
	Pos++;
	while(1) //handle stop condition
	{
		if (state & S_Head)
		{
			if (isalpha(Html[Pos]) && !(state & S_Label)) { 
				state = state | S_Name; }
			else { name.clear(); state = S_Head | S_Label; }
			if (state & S_Name) { 
				name+=Html[Pos]; }
			if (name == "input") { 
				state = S_Tail; }
			if (Html[Pos] == '>')
			{
				state = S_Content;
			}
		}
		else if (state & S_Content)
		{
			if (Html[Pos] == '<')
			{
				//Pos++;
				if (Html[Pos+1] == '/')
				{
					state = S_Tail;
				}
				else//removed  if ((*Html)[Pos] == '<')
				{
					state = S_Head;
					level++;
					
					//sibling
					if (level == 0) 
					{ 
						sibling++;
						if (stopCondition == E_Sibling) { return; }
					}
					//child
					else
					{
						if (stopCondition == E_Child) { return; }
					}
				}
			}
		}
		else if (state & S_Tail)
		{
			if (Html[Pos] == '>')
			{
				//parent
				state = S_Content;
				level--;
				if (stopCondition == E_Parent) { return; }
			}
		}
		
		Pos++;
		
		
	}
}

void HtmlParser::NavParent()
{
	
}

void HtmlParser::NavChild()
{
	Traverse(E_Child);
}

void HtmlParser::NavNextSibling()
{
	Traverse(E_Sibling);
}

void HtmlParser::NavPrevSibling()
{
	
}

void HtmlParser::Alighn(int dir)
{
	u8 state = 0;
	if (dir < 0)
	{
		while (Pos > 0)
		{
			if (state == 1 && isalpha(Html[Pos])) 
			{
				state = 1;
			}
			
		}
	}
}

bool HtmlParser::Find(std::string str)
{
	long i = 0, offset = 0, start = -1;
	
	while (i < (int)str.size() && Pos + offset < Length)
	{
		if (Html[Pos+offset] == str[i]) 
		{ 
			i++; 
			if (start < 0) { start = Pos + offset; }
			offset++; 
		}
		else if (i > 0) { i = 0; start = -1; }
		else { offset++; }
	}
	
	if ( i == (int)str.size() && start >= 0 && start < Length ) { Pos = start; return true; }
	else { return false; }
}


std::string HtmlParser::GetName()
{
	int len = 0;
	while (isalpha(Html[Pos+1+len])) { len++; }
	return std::string(Html+Pos+1, len);
}

std::vector<HtmlLabel> HtmlParser::GetLabels()
{
	int pos = Pos+1;
	std::vector<HtmlLabel> labels;
	u8 state = S_Head;
	bool loop = true;
	
	//bypass name
	while (isalpha(Html[pos])) { pos++; }
	
	//parse labels
	while(loop)
	{
		if (state == S_Head)
		{
			if (Html[pos] == '>') { loop = false; }
			else if (isalpha(Html[pos])) { state = S_Label; labels.push_back(HtmlLabel()); }
			else { pos++; }
		}
		else if (state == S_Label)
		{
			if (Html[pos] == '=') { state = S_Value; pos++; }
			else { labels.back().Label += Html[pos]; }
			pos++;
		}
		else if (state == S_Value)
		{
			if (Html[pos] == '"') { state = S_Head; }
			else { labels.back().Content += Html[pos]; }
			pos++;
		}
	}
	
	return labels;
}

std::string HtmlParser::GetContent()
{
	std::string content;
	int pos = Pos+1;
	while (Html[pos] != '>') { pos++; } 
	pos++;
	while (Html[pos] != '<') { content+=Html[pos]; pos++; }
	
	return content;
}

std::string HtmlParser::ReadRaw(long len)
{
	return std::string(Html+Pos, len);
}


void Parse(std::vector<std::string> CourseCodes)
{
	HtmlParser parser, sectionParser, contentParser;
	
	parser.OpenHtml("CIS 2430.html");
	parser.Find("<table summary=\"WSS.COURSE.SECTIONS\">");
	
	parser.NavChild(); parser.NavChild(); parser.NavNextSibling(); parser.NavChild(); 
	
	sectionParser = parser;
	sectionParser.NavNextSibling(); sectionParser.NavNextSibling(); sectionParser.NavNextSibling(); sectionParser.NavNextSibling(); sectionParser.NavNextSibling(); 
	
	contentParser = sectionParser;
	contentParser.NavChild();  contentParser.NavChild(); 
	
	
	std::cout << "Read: <"  << contentParser.GetName() << "  ";
	std::vector<HtmlLabel> labels = contentParser.GetLabels();
	for (int i = 0; i < (int)labels.size(); i++) { std::cout << labels[i].Label << "=\"" << labels[i].Content << "\" "; }
	std::cout << ">\n";
	std::cout << "Content: \"" << contentParser.GetContent() << "\"\n";
	
	parser.CloseHtml();
}

bool HtmlParser::OpenHtml(std::string fileName)
{
	if (Html) { CloseHtml(); }
	
	Pos = 0;
	Length = 0;
	
	FILE *file = 0;
	
	file = fopen(fileName.c_str(), "r");
	if (!file) { return false; }	
	
	fseek(file, 0, SEEK_END);
	Length = ftell(file);
	fseek(file, 0, SEEK_SET);
	
	Html = new char[Length];
	fread(Html, 1, Length, file);
	
	fclose(file);
	
	return true;
}

void HtmlParser::CloseHtml()
{
	if (Html) { delete[] Html; Html = 0; }
}
