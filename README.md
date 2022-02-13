# 1. General Information

This is the unchanged and unfiltered code for the site https://alchemyanimals.art/premint with backend located at https://alchemyanimals.art/backend.

We at Alchemy Animals value Data Privacy and Code Transparency over all. That's why we decided to completely dump the unchanged and unfiltered code for our premint page under MIT license onto Github.

This means you are allowed to check and reuse our code for your project!


# 2. OAuth2 Flow for Discord and Twitter

We use the official OAuth2 Flow of Discord and Twitter, Documentations can be found here: 

## 2.1 Discord
Discord OAuth2 Documentation:
https://discord.com/developers/docs/topics/oauth2

Our Implementation:
/backend/premint/set_discord.php

### 2.1.1 Discord OAuth2 Permissions/Scope

As can be seen in the following line of code

```
'scope' => 'identify guilds.members.read'
```
/backend/premint/set_discord.php Line:23

we use the scope identify and guilds.members.read for discord oauth2.

These two scopes are absolutely needed to collect the following 2 pieces of information for each user:

1. Discord Username of user
2. Discord Roles of user ONLY on discord.gg/alchemyanimals

## 2.2 Twitter

Twitter OAuth2 Documentation:
https://developer.twitter.com/en/docs/authentication/oauth-2-0/authorization-code

Our Implementation: 
/backend/premint/set_twitter.php

### 2.2.1 Twitter OAuth2 Permissions/Scope

As can be seen in the following line of code

```
'scope' => 'follows.read users.read tweet.read'
```
/backend/premint/set_twitter.php Line:28

we use the scopes follows.read users.read tweet.read for OAuth2.

#### WHY THIS MANY PERMISSIONS?

In order for the Twitter API to request the Endpoint /users/:id/followers (EVEN if it's for our own @AlchemyAnimals Twitter Account), the API needs all three of these scope parameters.

See official OAuth2 Docs (Under Chapter OAuth 2.0 scopes required by this endpoint):
![Twitter Scope](docs/images/twitter_scope.png?raw=true)
https://developer.twitter.com/en/docs/twitter-api/users/follows/api-reference/get-users-id-followers

# 3. What Data do we save?

```
  $record->Discord = $discord;
  $record->Twitter = 'complete';
  $record->Wallet = $wallet;
  $DB->insert_record('premint', $record);
```
/backend/premint/get_session.php

We only save 2 important values:

## 3.1 Your Wallet ID

We save the wallet ID to our database, because at mint we need to know all the wallets, which are able to buy a token.

## 3.2 Your Discord Username

We save the discord username, so that at mint we can verify AGAIN, that the user indeed has The Divine role in our discord.


# 4. Wallet Connect

Wallet Connect on our website is being provided by NoahZinsmeister's brilliant library Web3React:
https://github.com/NoahZinsmeister/web3-react

Please read up on it's privacy policy.


###

