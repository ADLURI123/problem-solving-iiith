#!/usr/bin/env python
import os
import random
from mod_python import util
from mod_python.util import redirect
from subprocess import *

fpath=os.path.abspath(__file__)
sfpath=fpath.split('/')
PATH=''
for x in sfpath[0:-1]:
        PATH=PATH+'/'+x
PATH=PATH+'/'
sum=0

Language_select_html ={"c":"""<select name="language" id="codeId">

<option value="c" selected="selected"> C (gcc 4.3.2) </option>

<option value="cpp"> C++ (g++ 4.3.2) </option>

</select>""", "cpp":"""<select name="language" id="codeId">

<option value="c"> C (gcc 4.3.2) </option>

<option value="cpp" selected="selected"> C++ (g++ 4.3.2) </option>

</select>"""};



code_select_html ={
	"Problem1":"""<select name="codeId" id="probId">

<option value="Problem1" selected="selected"> 1  </option>

<option value="Problem2"> 2  </option>

</select>""","Problem2":"""<select name="codeId" id="codeId">

<option value="Problem1"> 1  </option>

<option value="Problem2" selected="selected"> 2  </option>

</select>"""


};
sum=100
def Compile(exename,language,codeName):
	if (language=="cpp"):
		cmd = "g++    -s -static -o  "+exename+"  "+codeName +" -lm";
	elif (language=="c"):
		cmd = "gcc    -s -static -o  "+exename+"  "+codeName + " -lm";
	p = Popen(cmd,shell=True,stdout=PIPE,stderr=STDOUT,close_fds=True);
	p.wait();
	status = p.stdout.read();
	return status
def getInputFileNames(directory):
	cmd = "ls "+directory+"/*.in";
	p = Popen(cmd,shell=True,stdout=PIPE,stderr=STDOUT,close_fds=True);
	p.wait();
	Files = p.stdout.read();
	Files = Files.strip();
	Files = Files.split('\n');
	return Files;
def index(req):	
	FormData = util.FieldStorage(req);
	langauge= FormData['language'];
	try:
		code = FormData['code'];
	except:
		code = ""
	codeId=FormData['codeId'];
	action = FormData['type']
	#save the code in a file 
	codeName = PATH + "currentCode."+langauge;
	F = open(codeName,"w");
	F.write(code);
	F.close();
	#Compile the code now and keep the executable in a a variable exename
	exename = PATH+"current.out";
	
	compileErrors = Compile(exename,langauge,codeName);
	if(action=="Compile" and compileErrors!=""):
			#return compilation error
			result = "Compile Error"
	elif(action=="Compile" and compileErrors==""):
			result = "Compilation successful"

	elif(action=="Run" and compileErrors==""):	
		#code compiled successfully
		#now have to execute current.out
		TEST_DIRECTORY = PATH +codeId  #directory where final-build cases are there
		InputTestFiles 	= getInputFileNames(TEST_DIRECTORY);
    
		for i in InputTestFiles:
			Input =  i #Input File where the final-build cases are there
			F=open(Input,"r");
			F.close();
			ExpectedOutput = i[:-3]+".out" #Expected Output
			F = open(ExpectedOutput,"r");
			EO = F.read();
			F.close();
			
			memoryLimit = 32 * 1024;#32 MB
			timeLimit = 1 #1sec
			Output = TEST_DIRECTORY+"/temp.out";
			cmd = PATH+"sandbox -a2 -f -m %d -t %d -i %s -o %s %s" % (memoryLimit,timeLimit,Input,Output,exename)


			p = Popen(cmd,shell=True,stdout=PIPE,stderr=STDOUT,close_fds=True);
			p.wait();
			F = open(Output,"r");
			O = F.read();
			F.close();
		
			status = p.stdout.read().strip().split('\n')[0]
			if status.split(' ')[0] == "OK":
				if EO==O:
					sum+=20
				else:
					sum=sum+0
			else:
				sum=sum+0
console.log(`score is ${sum}.`);