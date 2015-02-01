#!/usr/bin/python

import sys, getopt

def compileMin():
  import subprocess
  subprocess.Popen(["java", "-jar", "./lib/tool/compiler.jar","./lib/src/poyEvo.js","./lib/src/poyEvo.js","--js_output_file","./bin/poyEvo.min.js"])
  
def compileDebug():
  src = ["./lib/src/poyEvo.js","./lib/src/poyEvo.js"]
  with open('./bin/poyEvo.js', 'w') as outfile:
      for fname in src:
          with open(fname) as infile:
              outfile.write(infile.read())

def main(argv):
  if(len(argv) > 1):
    try:
      opts, args = getopt.getopt(argv[1:],"hd",["help","debug"])
    except getopt.GetoptError:
      print 'compile.py -<OPTIONS>'
      sys.exit(2)
    for opt, arg in opts:
      if opt in ("-d"):
        print 'Debug only';
        compileDebug()
      else:
         print 'compile.py [-d]';
         sys.exit();
  else:
    print 'Compile all';
    compileDebug();
    compileMin();
    

if __name__ == "__main__":
   main(sys.argv)

