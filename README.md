# Codeforces Helper

Codeforces Helper is a Node.js executable that accepts a URL to a problem in www.codeforces.com, and sets up a folder for the problem with all the test cases in the problem. As a bonus, a template and test script is made!

This saves a lot of setup time, so one can just focus on solving the problem! :smile:

The tool is limited to public pages, thus it will not be able to extract problem data from private contests.

NOTE: To use the test script, the C++ executable should be named "sol" (g++ -std=c++14 <code.cpp> -o sol)

## Installation ##

Requirements:

1. Node.js

Steps:

1. Open a terminal and change to the project directory
2. Enter the following command:

	```
		> npm install -g cfhelper
	```

## Usage ##

cfhelper expects two arguments, directory, and URL

	cfhelper <directory> <URL>

For instance,

	cfhelper . http://codeforces.com/problemset/problem/228/A
