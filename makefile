
F=-D LINUX
GPP=g++ -std=c++17 -Wall -lncurses -lcurl -lpthread $F $T
D=Build
T=

all: dir $D/run.exe

dir:
	mkdir -p $D

$D/run.exe: dir $D/main.o
	$(GPP) $D/main.o -o $D/run.exe
	
$D/main.o: dir main.cpp
	$(GPP) main.cpp -c -o $D/main.o
	
run: all
	$D/run.exe
	
clean:
	rm $D/* -f
	
force: clean all

debug: T=$F -D DEBUG -ggdb
debug: force