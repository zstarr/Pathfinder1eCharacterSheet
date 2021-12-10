# Pathfinder 1e Character Sheet
This project has been stopped. (Partially because I'm moving away from Pathfinder)

The goal of this project was to have a fully async character sheet. I wasn't a fan of many online solutions for picky reasons, so I wanted to see how hard it would be to do a proof of concept of my own.
I wanted to push my Angular skills.

Its features include:
* Google auth to manage characters
* Async character updates to the database
 * Changing the values will update anyone else who would have access to it.
* Adding and removing characters
* All calculated fields done for you
 * Future plan would allow you to add temp values for things missed. 


The site currently exits on a free [firebase page](https://starrsheets.web.app/) live. 

## Steps to run the project locally
0. [Install node.js for npm if needed.](https://nodejs.org/en/download/)
0. Clone the repo
0. Navigate to the `/Pathfinder1eCharacterSheet` folder
0. Run `npm i`
0. `npm run start`
