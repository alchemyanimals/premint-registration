<?php
session_start();
include('../lib/connection.php');

// set wallet into php session
$_SESSION['wallet_auth'] = $_POST['wallet'];
// restore discord/twitter from session if available
$discord = isset($_SESSION['discord_auth']) ? $_SESSION['discord_auth'] : "not available";
$twitter = isset($_SESSION['twitter_auth']) ? $_SESSION['twitter_auth'] : "not available";

// restore distord/twitter from previous session if available
if($DB->record_exists('premint', array('Wallet'=>$_POST['wallet']))) {
    $rec = $DB->get_record('premint', array('Wallet'=>$_POST['wallet']));
    $_SESSION['discord_auth'] = $rec['Discord'];
    $_SESSION['twitter_auth'] = 'complete';
}