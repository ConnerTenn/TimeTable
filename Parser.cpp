
#include "Parser.h"

HtmlParser::~HtmlParser()
{
	CloseHtml();
}


void HtmlParser::Traverse(HtmlEvents stopCondition)
{	
	u8 state = S_Head;
	int level = 0, sibling = 0;
	Pos++;
	while(1)
	{
		if (state & S_Head)
		{
			if (Html[Pos] == '>')
			{
				state = S_Content;
			}
		}
		else if (state & S_Content)
		{
			if (Html[Pos] == '<')
			{
				Pos++;
				if (Html[Pos] == '/')
				{
					state = S_Tail;
				}
				else//removed  if ((*Html)[Pos] == '<')
				{
					//child
					state = S_Head;
					level++;
					if (stopCondition == E_Child) { return; }
					
					//sibling
					if (level == 0) 
					{ 
						sibling++;
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
	return "";
}

std::vector<HtmlLabel> HtmlParser::GetLabels()
{
	return {};
}

std::string HtmlParser::GetContent()
{
	return "";
}

std::string HtmlParser::ReadRaw(long len)
{
	return std::string(Html+Pos, len);
}


void Parse(std::vector<std::string> CourseCodes)
{
	//Jump to initial point
	//<table summary="WSS.COURSE.SECTIONS">
	
	
	
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
