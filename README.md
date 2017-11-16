# Codeforces Helper

[![npm version](https://badge.fury.io/js/cfhelper.svg)](https://badge.fury.io/js/cfhelper)

Codeforces Helper is a Node.js executable that accepts a URL to a problem or contest in www.codeforces.com, and sets up a folder for the problem with all the test cases. As a bonus, a template and test script is made! This saves a lot of setup time, so one can just focus on solving the problem! :smile:

NOTE: To use the test script, the C++ executable should be named "sol" (g++ -std=c++14 <code.cpp> -o sol)

Codeforces Helper is free to use! If you like it, please support me and give it a star on my Github, www.github.com/callistusystan/codeforcesHelper :star:

If there are any problems with the tool, feel free to raise an issue on the Github repo, www.github.com/callistusystan/codeforcesHelper/issues or send me an email at callistusystan@gmail.com

## Announcements ##

Codeforces Helper is still very new, with more updates and functionalities to come, so don't forget to update the tool!

	> npm update -g cfhelper

Thank you to all users for choosing to use Codeforces Helper!

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

	cfhelper [-h | --help] [<directory> <URL>] [--set <templateFile>] [--reset] [--notest] [--test]

 	-h | --help
		Displays the documentation

	<directory> <URL>
		Extracts the data of problem(s) in the URL and creates a new folder for the problem(s)
		in the specified directory

		Example: cfhelper . http://codeforces.com/problemset/problem/1/A
		Example: cfhelper ./contest1 http://codeforces.com/contest/1
		NOTE: URL must be a publicly accessible link to a Codeforces problem or contest

	--set <templateFile>
		Sets the specified template file that will be generated when extracting problem data

		Example: cfhelper --set ./template.py
		NOTE: templateFile must be a valid path to an existing file

	--reset
		Resets the template file to the default C++ file

	--notest
		Command to disable the creation of test script

	--test
		Command to enable the creation of test script
