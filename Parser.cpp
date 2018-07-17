
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


bool HtmlParser::Traverse(HtmlEvents stopCondition)
{	
	u8 state = S_Head;
	int level = 0, sibling = 0;
	std::string name;
	
	Pos++;
	while(Pos < Length)
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
						if (stopCondition == E_Sibling || stopCondition == E_Next) { return true; }
						else { return false; }
					}
					//child
					else
					{
						if (stopCondition == E_Child || stopCondition == E_Next) { return true; }
						else if (stopCondition == E_Sibling && level != 0) {}
						else { return false; }
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
				//if (stopCondition == E_Parent) { return true; }
				if ((stopCondition == E_Sibling || stopCondition == E_Child) && level < -1) { return false; }
			}
		}
		
		Pos++;
		
		
	}
	
	return false;
}

bool HtmlParser::NavNext()
{
	HtmlParser parser = *this;
	if (parser.Traverse(E_Next))
	{
		Pos = parser.Pos;
		return true;
	}
	return false;
}

bool HtmlParser::NavParent()
{
	return false;
}

bool HtmlParser::NavChild()
{
	HtmlParser parser = *this;
	if (parser.Traverse(E_Child))
	{
		Pos = parser.Pos;
		return true;
	}
	return false;
}

bool HtmlParser::NavNextSibling()
{
	HtmlParser parser = *this;
	if (parser.Traverse(E_Sibling))
	{
		Pos = parser.Pos;
		return true;
	}
	return false;
}

bool HtmlParser::NavPrevSibling()
{
	return false;
}

bool HtmlParser::NavToKey(std::string key)
{
	while(NavNext())
	{
		std::vector<HtmlLabel> labels = GetLabels();
		for (int i = 0; i < (int)labels.size(); i++)
		{
			if (labels[i].Content.find(key) != std::string::npos) { return true; }
		}
	}
	return false;
}

void HtmlParser::Alighn(int dir)
{
	if (dir < -1) { Pos--; }
	if (dir > 1) { Pos++; }
	if (dir < 0)
	{
		while (Pos > 0 && !(Html[Pos] == '<' && isalpha(Html[Pos+1]))) { Pos--; }
	}
	else if (dir > 0)
	{
		while (Pos < Length && !(Html[Pos] == '<' && isalpha(Html[Pos+1]))) { Pos++; }
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
	int level = 0;
	
	while (Html[pos] != '>') { pos++; } 
	pos++;
	
	while (!(Html[pos] == '<' && Html[pos+1] == '/') || level > 0) 
	{ 
		if (Html[pos] == '<' && isalpha(Html[pos+1])) { 
			level++; }
		else if (Html[pos] == '<' && Html[pos+1] == '/') { 
			while (Html[pos] != '>') { pos++; } pos++; level--; } 
		
		if (level == 0) { content+=Html[pos]; }
		pos++; 
	}
	
	
	
	return content;
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

std::string HtmlParser::GetRaw(long len)
{
	return std::string(Html+Pos, len);
}

void HtmlParser::PrintTag()
{
	std::cout << "<" << GetName() << "  ";
	std::vector<HtmlLabel> labels = GetLabels();
	for (int i = 0; i < (int)labels.size(); i++) { std::cout << labels[i].Label << "=\"" << labels[i].Content << "\" "; }
	std::cout << ">\n";
}

void HtmlParser::PrintRemoveTags()
{
	bool print = true;
	int i = 0;
	while (i < Length)
	{
		if (Html[i] == '<') { print = false; }
		else if (Html[i] == '>') { print = true; }
		else { if (print) { std::cout << Html[i]; } }
		i++;
	}
}

