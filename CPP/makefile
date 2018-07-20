
F=-D LINUX
GPP=g++ -std=c++17 -Wall -lncurses -lcurl -lpthread $F $T
D=Build
T=

all: begin dir $D/run.exe

begin:
	echo -e "\e[1;36m == Starting Build ==\e[0m"

dir: begin
	mkdir -p $D

$D/run.exe: dir $D/main.o $D/Schedule.o $D/Parser.o $D/ParserFunctions.o
	$(GPP) $D/main.o $D/Schedule.o $D/Parser.o $D/ParserFunctions.o -o $D/run.exe
	echo -e "\e[1;36m == Done Build ==\e[0m\n"

$D/main.o: dir main.cpp Schedule.h Parser.h
	$(GPP) main.cpp -c -o $D/main.o
	
$D/Schedule.o: dir Schedule.cpp Schedule.h
	$(GPP) Schedule.cpp -c -o $D/Schedule.o
	
$D/Parser.o: dir Parser.cpp Parser.h
	$(GPP) Parser.cpp -c -o $D/Parser.o
	
$D/ParserFunctions.o: dir ParserFunctions.cpp Parser.h
	$(GPP) ParserFunctions.cpp -c -o $D/ParserFunctions.o
	
run: all
	$D/run.exe
	
clean:
	rm $D/* -f
	
force: clean all

debug: T=$F -D DEBUG -ggdb
debug: force