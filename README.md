# Codeforces Helper

Codeforces Helper is a Node.js executable that accepts a URL to a problem in www.codeforces.com, and sets up a folder for the problem with all the test cases in the problem. As a bonus, a template and test script is made!

This saves a lot of setup time, so one can just focus on solving the problem! :smile:

NOTE: To use the test script, the C++ executable should be named "sol"

## Installation ##

Requirements:

1. Node.js

Steps:

1. Clone this project and extract it on your computer
2. Open a terminal and change to the project directory
3. Enter the following commands:

	```
		> npm install -g  .
	```

## Usage ##

cfhelper expects two arguments, directory, and URL

	cfhelper <directory> <URL>

For instance,

	cfhelper . http://codeforces.com/problemset/problem/228/A
