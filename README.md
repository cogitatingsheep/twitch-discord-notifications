# Twitch notification to Discord for free without IFTTT

IFTTT was very slow so I created an alterenative notification bot

To use:

1. Set up a webhook in your discord server 

2. log into https://dev.twitch.tv and register a new application to get a “Client ID” and a “Client Secret”

3. Change the value of clientId, clientSecret, webhook and userLogin within index.js

4. Upload the code to heroku for free (or glitch or replit if you prefer)

This will check every minute to see if the twitch streamer is online