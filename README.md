# Codeforces Helper

[![npm version](https://badge.fury.io/js/cfhelper.svg)](https://badge.fury.io/js/cfhelper)

Codeforces Helper is a Node.js executable that accepts a URL to a problem in www.codeforces.com, and sets up a folder for the problem with all the test cases in the problem. As a bonus, a template and test script is made!

This saves a lot of setup time, so one can just focus on solving the problem! :smile:

The tool is limited to public pages, thus it will not be able to extract problem data from private contests.

Codeforces is free to use! If you like it, please support me and give it a star on my Github! :star:

NOTE: To use the test script, the C++ executable should be named "sol" (g++ -std=c++14 <code.cpp> -o sol)

## Installation ##

Requirements:

1. Node.js with NPM

Steps:

1. Open a terminal (with Node.js installed)
2. Enter the following command:

	```
		> npm install -g cfhelper
	```

## Usage ##

	cfhelper [-h | --help] [--set <templateFile>] [--reset] [<directory> <URL>]

   	-h | --help
		Displays this help file
	--set <templateFile>
		Sets the specified template file that will be generated when extracting problem data
		NOTE: templateFile must be a valid path to an existing file
		Example: cfhelper --set template.py
	--reset
		Resets the template file to the default C++ file
	<directory> <URL>
		Extracts the problem data in the URL and CREATES a new folder in the specified directory
		NOTE: URL must be a publicly accessible link to a Codeforces problem
		Example: cfhelper . http://codeforces.com/problemset/problem/1/A
