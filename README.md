# Why the heck does this exist?
I needed something to actually grab the contents of a git commit, not just the commit message.
I couldn't find anything that did this, so I made it myself.

My usecase was for handling Changelogs to be sent to a discord server.


# How to use this
Copy the `.env.example` file to `.env` and fill in the values.
then run `node .` or `npm run start` to run the script.

This script has an auto installer built in to install dependencies on startup.

Finally send a webhook request to `[wherever you have this running]/webhook` with the appropriate `[x-hub-signature]` header