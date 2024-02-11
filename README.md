# Why the heck does this exist?
I needed something to actually grab the contents of a git commit, not just the commit message.
I couldn't find anything that did this, so I made it myself.

My usecase was for handling Changelogs to be sent to a discord server.


# How to use this
Copy the `.env.example` file to `.env` and fill in the values.
then run `node .` or `npm run start` to run the script.

This script has an auto installer built in to install dependencies on startup.

Finally send a webhook request to `[wherever you have this running]/webhook` with the appropriate `[x-hub-signature]` header

.env example:
```env
#DISCORD CONFIG
WEBHOOK_TOKEN = BOT_TOKEN_XXXXXXXXXXXXX
WEBHOOK_CHANNEL = 123456789
ROLE = 123456789
COLOR = 9999999 # https://gist.github.com/thomasbnt/b6f455e2c7d743b796917fa3c205f812

#GIT INFO
GIT_USERNAME = "DarkeFae"
GIT_REPOSITORY = "changelog"
GIT_TOKEN = "adfsljkghasdfgsfdahgfdah"

#WEBSERVER CONFIG
WEB_SERVER_PORT = 3001
WEB_SERVER_SECRET = apple
```

## Replacables:
- `<done>`
- `<todo>`
- `<broke>`