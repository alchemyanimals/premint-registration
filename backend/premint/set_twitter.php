<?php
ini_set('max_execution_time', 300); //300 seconds = 5 minutes. In case if your CURL is slow and is loading too much (Can be IPv6 problem)

define('OAUTH2_CLIENT_ID', '----------'); //Your client Id
define('OAUTH2_CLIENT_SECRET', '----------'); //Your secret client code

// discord authorization url
$authorizeURL = 'https://twitter.com/i/oauth2/authorize';
// token verification url
$tokenURL = 'https://api.twitter.com/2/oauth2/token';
// user query url
$userURL = "https://api.twitter.com/2/users/me";
// friendship query url
$friendshipURL = "https://api.twitter.com/2/users/";
session_start();

// Start the login process by sending the user to Discord's authorization page
if(get('action') == 'login') {
  // get random hash authenticating the query
  $state = getState(43);
  // on mobile, we use metamask deeplinks, in order to get the user back into metamask after redirect
  if(isMobile()) {
    $params = array(
      'response_type' => 'code',
      'client_id' => OAUTH2_CLIENT_ID,
      'redirect_uri' => 'https://metamask.app.link/dapp/alchemyanimals.art/premint',
      // sadly we need the following scope JUST to access twitter followers of our OWN account and username of user account
      'scope' => 'follows.read users.read tweet.read',
      'state' => $state,
      'code_challenge' => $state,
      'code_challenge_method' => 'plain'
    );
  } else {
    // params according to twitter documentation
    $params = array(
      'response_type' => 'code',
      'client_id' => OAUTH2_CLIENT_ID,
      'redirect_uri' => 'https://alchemyanimals.art/premint',
      // sadly we need the following scope JUST to access twitter followers of our OWN account and username of user account
      'scope' => 'follows.read users.read tweet.read',
      'state' => $state,
      'code_challenge' => $state,
      'code_challenge_method' => 'plain'
    );
  }
  // put into session (after redirect this value is needed)
  $_SESSION['twitter_code_verifier'] = $state;
  unset($_SESSION['access_token_twitter']);

  // Redirect the user to Discord's authorization page
  header('Location: '. $authorizeURL . '?' . http_build_query($params));
  die();
}
// this part is sent via ajax from frontend, there will be a "code" and "state" in the postfields
if(post('code')) {
  // if mobile, metamask deeplink needed again
  if(isMobile()) {
    $data = array(
      "grant_type" => "authorization_code",
      'redirect_uri' => 'https://metamask.app.link/dapp/alchemyanimals.art/premint',
      'code' => post('code'),
      "client_id" => OAUTH2_CLIENT_ID,
      'code_verifier' => post('state')
    );
  } else {
    $data = array(
      "grant_type" => "authorization_code",
      'redirect_uri' => 'https://alchemyanimals.art/premint',
      'code' => post('code'),
      "client_id" => OAUTH2_CLIENT_ID,
      'code_verifier' => post('state')
    );
  }
  // request to get the token from twitter
  $token = apiRequest($tokenURL, $data, array(), true);
  
  // error handling for this request
  if($token != null && property_exists($token, 'access_token')) {
    $logout_token = $token->access_token;
    $_SESSION['access_token_twitter'] = $token->access_token;
  } else {
    echo'{"result":"error", "message": "Invalid request"}';
    die();
  }
  
}

// authentication successfull
if(session('access_token_twitter')) {
  // query userid from twitter in order to ask twitter if the user has subscribed to our twitter
  $me = apiRequest($userURL);
  if(!property_exists($me, 'data') || !property_exists($me->data, 'id')) {
    echo'{"result": "error", "message": "could not query user data"}';
    die();
  }
  $userid = $me->data->id;
  // view the followers of @alchemyanimals (NOT THE PEOPLE YOU ARE FOLLOWING)
  $users = apiRequest($friendshipURL.'1418086153731837953/followers?max_results=1000&user.fields=id', false, array(), false);
  // error handling for this request
  if(!property_exists($users, 'data')) {
    echo'{"result": "error", "message": "could not query user data"}';
    die();
  }
  $found = false;
  $data = $users->data;
  // twitter api only returns 1000 followers per request, therefore we have to send multiple requests to get all followers of alchemyanimals
  while(property_exists($users, 'meta') && property_exists($users->meta, 'next_token')) {
    // send next request user.fields=id makes sure that ONLY user id's are returned
    $users = apiRequest($friendshipURL.'1418086153731837953/followers?max_results=1000&user.fields=id&pagination_token='.
    $users->meta->next_token, false, array(), false);
    // merge data with this request if successfull
    if(property_exists($users, 'data')) $data = array_merge($data, $users->data);
  }
  // iterate through users and find out if the user with id $userid is in the follower list
  foreach($data as $user) {
    if($user->id == $userid) {
      $found = true;
      break;
    } 
  }
  // error handling in the case that you're not subscribed
  if(!$found) {
    echo'{"result": "error", "message": "Please subscribe to @alchemyanimals on twitter"}';
    die();
  }
  // SUCCESS! ONLY store the word 'complete' in the session
  $_SESSION['twitter_auth'] = 'complete';
  echo'{"result": "success", "user": "complete"}';
} else {
  // error
  echo'{"result": "error", "message": "There was an error with the twitter authentication"}';
}

// function to send api request, if authenticated, Bearer token is in header, if we need basic authentication, we hash together Client_ID and Client_Secret
function apiRequest($url, $post=FALSE, $headers=array(), $basic=false) {
  $ch = curl_init($url);
  curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);

  $response = curl_exec($ch);
  if($post)
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post));

  $headers[] = "Content-Type: application/x-www-form-urlencoded";
  if($basic) {
    $auth = base64_encode(OAUTH2_CLIENT_ID.':'.OAUTH2_CLIENT_SECRET);
    $headers[] = "Authorization: Basic ".$auth;
  }
  if(session('access_token_twitter'))
    $headers[] = 'Authorization: Bearer ' . session('access_token_twitter');

  curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

  $response = curl_exec($ch);
  return json_decode($response);
}
// get property in url query string
function get($key, $default=NULL) {
  return array_key_exists($key, $_GET) ? $_GET[$key] : $default;
}
// get property in postfields
function post($key, $default=NULL) {
  return array_key_exists($key, $_POST) ? $_POST[$key] : $default;
}
// get property from session
function session($key, $default=NULL) {
  return array_key_exists($key, $_SESSION) ? $_SESSION[$key] : $default;
}
// base64 encode
function base64_urlencode($hash) {
    return rtrim(strtr(base64_encode($hash), '+/', '-_'), '=');
}
// get state for query authentication
function getState($n) {
  $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  $randomString = '';
  for ($i = 0; $i < $n; $i++) {
    $index = rand(0, strlen($characters) - 1);
    $randomString .= $characters[$index];
  }
  return $randomString;
}
// check if user is on mobile
function isMobile() {
  return preg_match("/(android|avantgo|blackberry|bolt|boost|cricket|docomo|fone|hiptop|mini|mobi|palm|phone|pie|tablet|up\.browser|up\.link|webos|wos)/i", $_SERVER["HTTP_USER_AGENT"]);
}
?>