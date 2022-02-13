<?php
session_start();
include('../lib/connection.php');

$discord = isset($_SESSION['discord_auth']) ? $_SESSION['discord_auth'] : "not available";
$twitter = isset($_SESSION['twitter_auth']) ? $_SESSION['twitter_auth'] : "not available";
$wallet = isset($_SESSION['wallet_auth']) ? $_SESSION['wallet_auth'] : "not available";

if($discord == 'complete') $discord = 'not available';

echo'{"discord":"'.$discord.'", "twitter":"'.$twitter.'", "wallet": "'.$wallet.'"}';

if(!$DB->record_exists('premint', array('Wallet'=>$wallet)) && !$DB->record_exists('premint', array('Discord'=>$discord)) && $wallet != 'not available' && $twitter != 'not available' && $discord != 'not available') {
    $record = new stdClass();
    $record->Discord = $discord;
    $record->Twitter = 'complete';
    $record->Wallet = $wallet;
    $DB->insert_record('premint', $record);
}