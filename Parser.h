
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
	char *Html = 0;
	long Length = 0;
	long Pos = 0;
	
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
	
public:
	HtmlParser();
	HtmlParser(HtmlParser &other, bool copy = false);
	~HtmlParser();
	
	inline long GetPos() { return Pos; }
	void SetPos(long pos) { Pos = MIN(MAX(pos, Length), 0); }
	void OffsetPos(long offset) { SetPos(Pos + offset); }
	
private:	
	void Traverse(HtmlEvents stopCondition);
	
public:

	void NavParent();
	void NavChild();
	void NavNextSibling();
	void NavPrevSibling();
	
	void Alighn(int dir = -1);
	bool Find(std::string str);
	
	std::string GetName();
	std::vector<HtmlLabel> GetLabels();
	std::string GetContent();
	std::string ReadRaw(long len);
	
	/*HtmlParser GetAtParent();
	HtmlParser GetAtChild();
	HtmlParser GetAtNextSibling();
	HtmlParser GetAtPrevSibling();*/
	
	bool OpenHtml(std::string fileName);
	void CloseHtml();
};

void Parse(std::vector<std::string> CourseCodes);

#endif

