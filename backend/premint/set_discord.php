<?php
ini_set('max_execution_time', 300); //300 seconds = 5 minutes. In case if your CURL is slow and is loading too much (Can be IPv6 problem)
define('OAUTH2_CLIENT_ID', '------------'); //Your client Id
define('OAUTH2_CLIENT_SECRET', '-----------'); //Your secret client code

// auth url to redirect user over
$authorizeURL = 'https://discordapp.com/api/oauth2/authorize';
// url to request token from after authentication
$tokenURL = 'https://discordapp.com/api/oauth2/token';
// url to request discord username from
$apiURLBase = 'https://discordapp.com/api/users/@me';
// url to request if user has a role in our guild (our discord server)
$apiGuildBase = 'https://discordapp.com/api/users/@me/guilds/870053210889551893/member';
session_start();
include('../lib/connection.php');
// Start the login process by sending the user to Discord's authorization page
if(get('action') == 'login') {
  $params = array(
    'client_id' => OAUTH2_CLIENT_ID,
    'redirect_uri' => 'https://alchemyanimals.art/premint',
    'response_type' => 'code',
    // this scope is necessary, we need the identify to get the discord username and guilds.members.read to read our discord server information
    'scope' => 'identify guilds.members.read'
  );

  // Redirect the user to Discord's authorization page
  header('Location: https://discordapp.com/api/oauth2/authorize' . '?' . http_build_query($params));
  die();
}

// this part is sent via ajax from frontend, there will be a "code" in the postfields
if(post('code')) {
  // Exchange the auth code for a token
  $token = apiRequest($tokenURL, array(
    "grant_type" => "authorization_code",
    'client_id' => OAUTH2_CLIENT_ID,
    'client_secret' => OAUTH2_CLIENT_SECRET,
    'redirect_uri' => 'https://alchemyanimals.art/premint',
    'code' => post('code')
  ));
  // error handling for token request
  if(!property_exists($token, 'access_token')) {
    echo'{"result": "error", "message": "Access could not be granted"}';
    die();
  }
  $logout_token = $token->access_token;
  // temporarily store access_token in the session (we need it later)
  $_SESSION['access_token_discord'] = $token->access_token;

  header('Location: ' . $_SERVER['PHP_SELF']);
}

// authentication successfull, we have the access token
if(session('access_token_discord')) {
  // request discord username information
  $discordusername = apiRequest($apiURLBase);
  // sleep 0.5 seconds, because the discord api has a request limit
  sleep(0.5);
  // request guild (discord server) information
  $guild = apiRequest($apiGuildBase);
  // error handling for this request
  if(!property_exists($guild, 'roles')) {
    echo'{"result":"error", "message":"You are not in our discord"}';
    die();
  }
  // check if the role 928025371004252302 (the divine) is in your roles on our discord server
  if(!in_array(928025371004252302, $guild->roles)) {
    echo'{"result": "error", "message":"You are not eligible for premint, check out twitter regularly for giveaways!"}';
    die();
  }
  // error handling for username request
  if(!property_exists($discordusername, 'username')) {
    echo'{"result":"error", "message":"Unable to authenticate"}';
    die();
  }
  // we store ONLY the discord username in the request
  $_SESSION['discord_auth'] = $discordusername->username;

  // if user is already authenticated (your discord username is in our database) we restore the previous session
  if($DB->record_exists('premint', array('Discord'=>$discordusername->username))) {
    $rec = $DB->get_record('premint', array('Discord'=>$discordusername->username));
    // in the database twitter is only stored as "complete"
    $_SESSION['twitter_auth'] = 'complete';
    $_SESSION['wallet_auth'] = $rec['Wallet'];
  }
  // success! we return the discord username to the frontend
  echo'{"result": "success", "discord": "'.$discordusername->username.'"}';

} else {
  // error handling if no authentication token is found in the session
  echo'{"result": "error", "message": "There was an error with the discord authentication"}';
}

// function to send api request, if authenticated, Bearer token is in header
function apiRequest($url, $post=FALSE, $headers=array()) {
  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);

  $response = curl_exec($ch);


  if($post)
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post));

  $headers[] = 'Accept: application/json';

  if(session('access_token_discord'))
    $headers[] = 'Authorization: Bearer ' . session('access_token_discord');

  curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

  $response = curl_exec($ch);
  return json_decode($response);
}

// find keys in postfields
function post($key, $default=NULL) {
  return array_key_exists($key, $_POST) ? $_POST[$key] : $default;
}
// find key in request url
function get($key, $default=NULL) {
  return array_key_exists($key, $_GET) ? $_GET[$key] : $default;
}
// find key in session
function session($key, $default=NULL) {
  return array_key_exists($key, $_SESSION) ? $_SESSION[$key] : $default;
}

?>