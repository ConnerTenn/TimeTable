
#ifndef _PARSE_H_
#define _PARSE_H_

#include "Schedule.h"

struct HtmlLabel
{
	std::string Label;
	std::string Content;
};

std::string RemPrePostWhite(std::string str);

class HtmlParser
{
public:
private:	
	char *Html = 0;
	long Length = 0;
	long Pos = 0;
	
private:
	enum HtmlStates
	{
		S_Head = 	0b00000001,
		S_Tail = 	0b00000010,
		S_Open = 	0b00000100,
		S_Close = 	0b00001000,
		
		S_Name = 	0b00010000,
		S_Label = 	0b00100000,
		S_Value =	0b01000000,
		S_Content =	0b10000000,
		//S_Unknown = 0b10000000
	};

	enum HtmlEvents
	{
		E_Parent,
		E_Child,
		E_Sibling,
		E_Next,
		/*E_Value,
		E_Content,
		S_Name,
		S_Label,
		S_Value,
		S_Content,*/
	};
	
public:
	HtmlParser();
	HtmlParser(HtmlParser &other, bool duplicate = false);
	~HtmlParser();
	void operator=(HtmlParser &other);
	
	inline long GetPos() { return Pos; }
	void SetPos(long pos) { Pos = MIN(MAX(pos, Length), 0); }
	void OffsetPos(long offset) { SetPos(Pos + offset); }
	
private:	
	bool Traverse(HtmlEvents stopCondition);
	
public:

	bool NavNext();
	bool NavParent();
	bool NavChild();
	bool NavNextSibling();
	bool NavPrevSibling();
	bool NavToKey(std::string key);
	
	void Alighn(int dir = -1);
	bool Find(std::string str);
	
	std::string GetName();
	std::vector<HtmlLabel> GetLabels();
	std::string GetContent();
	
	/*HtmlParser GetAtParent();
	HtmlParser GetAtChild();
	HtmlParser GetAtNextSibling();
	HtmlParser GetAtPrevSibling();*/
	
	bool OpenHtml(std::string fileName);
	void CloseHtml();
	
	std::string GetRaw(long len);
	void PrintTag();
	void PrintRemoveTags();
};


void ParseSection(HtmlParser parser);

void Parse(std::vector<std::string> CourseCodes);

#endif

