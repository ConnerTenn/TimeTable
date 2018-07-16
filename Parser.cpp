
#include "Parser.h"

void HtmlParser::Traverse(HtmlEvents stopCondition, int stopLevel)
{	
	/*Pos += dir;
	while(1)
	{
		if (state & S_Head)
		{
			if (state == (S_Head | S_Open))
			{
				while(!isalpha((*Html)[Pos])) { Pos++; }
				state = S_Head | S_Name;
			}
			else if (state == (S_Head | S_Name))
			{
				while(isalpha((*Html)[Pos])) { Pos++; }
				while(!isalpha((*Html)[Pos])) { Pos++; }
				state = S_Head | S_Label;
			}
			else if (state == (S_Head | S_Label))
			{
				while((*Html)[Pos] != '=') { Pos++; }
				Pos++;
				state = S_Head | S_Value;
			}
			else if (state == (S_Head | S_Value))
			{
				if ((*Html)[Pos] == '"')
				{
					Pos++;
					while((*Html)[Pos] != '"') { Pos++; }
				}
				else
				{
						
				}
				
				state = S_Head | S_Value;
			}
		}
		else if (state & S_Tail)
		{
			
		}
	}*/
	
	u8 state = S_Head;
	int level = 0, sibling = 0;
	Pos++;
	while(1)
	{
		if (state & S_Head)
		{
			if ((*Html)[Pos] == '>')
			{
				state = S_Content;
			}
		}
		else if (state & S_Content)
		{
			if ((*Html)[Pos] == '<')
			{
				Pos++;
				if ((*Html)[Pos] == '/')
				{
					state = S_Tail;
				}
				else//removed  if ((*Html)[Pos] == '<')
				{
					//child
					state = S_Head;
					level++;
					if (stopCondition == E_Child && stopLevel == level) { return; }
					
					//sibling
					if (level == 0) 
					{ 
						sibling++;
						if (stopCondition == E_Child && stopLevel == sibling) { return; }
					}
				}
			}
		}
		else if (state & S_Tail)
		{
			if ((*Html)[Pos] == '>')
			{
				//parent
				state = S_Content;
				level--;
				if (stopCondition == E_Parent && stopLevel == -level) { return; }
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