# GetEm -🔫 One bot to stop 'em all!
## Setup instructions
1. Clone the github repository and install the dependencies using `npm install`.
2. Create a bot using the following steps:
   - https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot
   - https://discordjs.guide/preparations/adding-your-bot-to-servers.html
   - https://discordjs.guide/creating-your-bot/#using-dotenv
3. In the above steps, make sure to give the bot the following permissions:
   - `Kick Members`
   - `Read Messages/View Channels`
   - `Send Messages`
   - `Manage Messages`
   - `Read Message History`
4. Invite the bot to your server.
5. Create a `.env` file in the project directory with the following variables
   - `DISCORD_TOKEN` : Your bot's secret login token.
   - `CLIENT_ID` : The client id of the bot.
   - `GUILD_ID` : The guildId of the guild in which you want to test the bot.
   - `DB_URI` : Your MongoDB database connection URI.
6. Once you are done setting up the bot, deploy the commands and be SURE to use the `/help` command first to register your server in the database.

Voila! You are done setting up the bot!

## Features

### Strong regex implementation
The bot uses Javascript's own regex based pattern matching to deliver blazing fast results. Never let anyone get away with anything.

### Three levels of offence
You can set three severities of spam (1-3). The outcomes for a regex violation range from a silent message delete, to a warning, to a kick. Always punish fairly.

### Multi-server deployment
The bot is extremely scalable as it uses a Document oriented database MongoDB as a backend.
Each server's configuration is stored in a single document using its `guildId`. This makes database queries fast and efficient.
Also, the bot can be turned on and off for maintainance and will 'remember' everything.

### Filter only select channels
Want to filter only a few rowdy channels while leaving every other channel untouched? No problem! Just use the `set-active-channels` command to select
one or more channels for the bot to work it's magic on.

### Role immunity
Want to give a few people the ability to say whatever they want? Want to exempt them from the wrath of the bot? No problem! Just use the `set-exempt-roles` command to select
one or more roles to remain unfiltered.

### Cleanup escaped spam
Did someone manage to escape all your regex checks? Improvise, Adapt, Overcome. Add the new entries using the `add-regex` command and then use the `remove-spam` command 
to cleanup escaped spam.

### Awesome logging system
Every action the bot takes can be logged, unless you prefer otherwise.

### Self handling of channel and role deletes
Did you delete one your Active Channels or a Mod Role and forget to update the bot configuration? No worries all this is handled by the bot 
to ensure errorless and smooth running

But this is not all, more features will be added in upcoming versions to truly flesh this bot out.
