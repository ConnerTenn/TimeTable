
#include "Parser.h"

void HtmlParser::Traverse(HtmlEvents stopCondition, int dir, u8 state)
{
	dir = (dir >=0 ? 1 : -1);
	
	//u8 state = S_Head | S_Open;
	/*if ((*Html)[Pos] == '<')
	{
		state = S_Open;
	}
	else if ((*Html)[Pos] == '>')
	{
		state = S_Close;
	}
	else if ((*Html)[Pos] == '=')
	{
		state = S_Value;
		Pos++;
	}
	else
	{
		state = S_Unknown;
	}*/
	
	
	Pos += dir;
	while(1)
	{
		if (state & S_Head)
		{
			if (state == (S_Head | S_Open))
			{
				while(!isalpha((*Html)[Pos])) { Pos++; }
				state = S_Head | S_Name;
			}
		}
		else if (state & S_Tail)
		{
			
		}
	}
}

void HtmlParser::NavParent()
{
	
}

void HtmlParser::NavChild()
{
	
}

void HtmlParser::NavNextSibling()
{
	
}

void HtmlParser::NavPrevSibling()
{
	
}

void HtmlParser::Alighn(int dir)
{
	
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


void Parse(std::vector<std::string> CourseCodes)
{
	//Jump to initial point
	//<table summary="WSS.COURSE.SECTIONS">
	
	
	
}