# EmployeeTracker

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## Table of Contents

1. [Description](#Description)
2. [Criteria](#Criteria)
3. [Installation](#Installation)
4. [Usage](#Usage)
5. [Contributing](#Contributing)
6. [Issues](#Issues)
7. [Credits](#Credits)
8. [License](#License)
9. [Tests](#Tests)
10. [Questions](#Questions)

## Description

We were tasked with creating an inquirer-based application that allowed users to view and edit information within a database. For my application, I also chose to use dotenv to conceal my MySql password and user information.

I used Inquirer and connection.query to define the queries I wanted to make in the database. I was able to also use a query to get the available options for a choice, push the options to an array, and use that array to give users the available options to choose from. I used console.table to first show a table of available options for certain requests, like deletion, and asked the user to input an ID based on the information available in the viewed table.

I attempted to do the bonus of adding the salaries of departments, but I did not give myself enough time to research further into SUM and how it works. I would also like to revisit this to see about cleaning up the functions and putting them into a different file to aid readability.

Unable to be deployed.

[Link to video demonstration](https://drive.google.com/file/d/1JqODEnd3qy2dtn7n_FKd8Y5sKaMwLnTw/view)

Example picture:

![Picture of example database view](./databaseAllEmployees.png)

## Criteria

Build a command-line application that at a minimum allows the user to:

  Add departments, roles, employees

    * Used a switch statement and inquirer to determine what the user wants to do

    * Depending on what needs to be added, the user is asked certain questions

    * Using the response, the data is inserted into the employee database.

  View departments, roles, employees

    * Used a switch statement and inquirer to determine what the user wants to do

    * Different queries are used to fetch data depending on what the user wants to view

    * Joins are used to show all applicable information

  Update employee roles

    * Inquirer is used to get the new role

    * A query is sent to the database to update the role

Bonus points if you're able to:

  Update employee managers

    * Inquirer is used to get the new manager from a provided list of managers

    * A query is sent to the database to update the manager ID.

  View employees by manager

    * Inquirer is used to get the manager to view

    * A query is sent to the database to fetch the employees with a matching manager ID

  Delete departments, roles, and employees

    * A switch statement and inquirer are used to determine what needs to be removed

    * A query is sent to the database to delete the department, role, or employee

    * Also, ON DELETE CASCADE was added

    * This way, when a department is deleted, the associated roles are deleted

  View the total utilized budget of a department -- ie the combined salaries of all employees in that department

    * Unable to implement at this time.

## Installation

Files must be downloaded from Github. Then, run npm install to get the necessary node modules. Edit or duplicate the .env.EXAMPLE file to be just a .env file and fill in your MySql username and password. Open the seed.sql in MySql and run the file. Last, run npm start.

## Usage

This is an application in which the user can view and edit data in a database with information about employees, job roles, and departments.

## Contributing

For contributions, please create a fork to work on then, when done, create a Pull Request.

## Issues

Submit an Issue through Github for any bugs or problems.

## Credits

Dummy information was taken from [test_db by datacharmer](https://github.com/datacharmer/test_db). Some of the information was edited and/or removed to suit this application.

## License

Copyright Ashley Wright 2021

This is covered under the <a href='https://opensource.org/licenses/ISC'>ISC</a> license.

## Tests

None

## Questions

Feel free to contact through the following with any questions:

Email: ashleyaggie@aol.com

Github: <a href='https://github.com/ashleyaggie'>ashleyaggie</a>