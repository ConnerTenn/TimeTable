
#ifndef _PARSE_H_
#define _PARSE_H_

#include "Schedule.h"

struct HtmlLabel
{
	std::string Label;
	std::string Content;
};

//#define BITCONT(a, b) ((a) & (b) == (b) ? 1 : 0)

class HtmlParser
{
public:
private:	
	std::string *Html;
	int Pos;
	
private:
	enum HtmlStates
	{
		S_Head = 	0b00001,
		S_Tail = 	0b00010,
		S_Open = 	0b00100,
		S_Close = 	0b01000,
		
		S_Name = 	0b01100,
		S_Label = 	0b100000,
		S_Value =	0b101000,
		S_Content =	0b110000,
		S_Unknown = 0b111000,
	};

	enum HtmlEvents
	{
		E_Parent,
		E_Child,
		E_Sibling,
		/*E_Value,
		E_Content,
		S_Name,
		S_Label,
		S_Value,
		S_Content,*/
	};
	
	void Traverse(HtmlEvents stopCondition, int stopLevel = 0);
	
public:
	void NavParent();
	void NavChild();
	void NavNextSibling();
	void NavPrevSibling();
	
	void Alighn(int dir = -1);
	
	std::string GetName();
	std::vector<HtmlLabel> GetLabels();
	std::string GetContent();
	
	/*HtmlParser GetAtParent();
	HtmlParser GetAtChild();
	HtmlParser GetAtNextSibling();
	HtmlParser GetAtPrevSibling();*/
	
	void OpenHtml();
	void CloseHtml();
};

void Parse(std::vector<std::string> CourseCodes);

#endif

