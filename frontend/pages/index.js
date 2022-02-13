import React from "react";
import Layout from '../components/layout'
import Seo from '../components/seo'
import { ContainerFullheight} from "../components/styled-components";
import { useRouter } from "next/router";
import styled from "styled-components";
import { isBrowser } from "browser-or-node";
import WalletConnectors from '../components/walletConnectors'
import Error from "../components/errorHandling";
import { useWeb3React } from "@web3-react/core";
import { useEagerConnect, useInactiveListener } from "../components/hooks";
import $ from 'jquery'
import { getFromEndpoint } from "../components/hooks";


// style for premint using styled components
const PremintBox = styled.div`
    width: 90%;
    height: 90%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &>h1 {
        color: white;
        font-size: 50px;
    }
    & .premint_container {
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-direction: row;
        text-align:center;
        height: 70%;
        & .premint_row {
            width: calc(100% / 3 - 50px);
            background-color: white;
            height: 80%;
            margin: 25px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-direction: column;
            padding: 30px;
            border-radius: 10px;
        }
    }
    button {
        border-radius: 100px;
        padding: 10px 20px;
        font-size: 20px;
        color: white;
        border: 0;
        display: flex; 
        flex-direction: row; 
        align-items: center;
        cursor: pointer;
        &.twitter {
            background-color: #1DA1F2;
        }
        &.discord {
            background-color: #5865F2;
        }
        &.wallet {
            color: black;
        }
        & img {
            margin: 0 0 0 5px;
        }
    }
    @media(max-width: 770px) {
        &>h1 {
            position: absolute;
            top: 10%;
        }
        & .premint_container {
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: fit-content;
            position: absolute;
            top: 20%;
            & .premint_row {
                width: 100%;
                height: 400px;
            }
        }

    }
`;

function PreMint() {
    if(!isBrowser) return (<div></div>);
    // use web3 context from provider (look into web3react documentation)
    const context = useWeb3React();
    const {
      connector,
      account,
      active,
      error
    } = context;
  
    // initiate some state
    const [doConnect, connectWallet] = React.useState(false);
    const [activatingConnector, setActivatingConnector] = React.useState();
    // check if we've got a connector that wants to authenticate
    React.useEffect(() => {
      if (activatingConnector && activatingConnector === connector) {
        setActivatingConnector(undefined);
      }
    }, [activatingConnector, connector]);
  
    // use eagerconnect
    const triedEager = useEagerConnect();
    const doEagerConnect = !triedEager || !!activatingConnector;
    useInactiveListener(doEagerConnect, throwError);
    
    // error handing
    const [err, throwError] = React.useState(false);
    React.useEffect(()=>{
      if(!!error) throwError(error);
    }, [error]);

    // if we get an account we send ONLY the walletID to the backend
    React.useEffect(()=>{
        if(!!account) getFromEndpoint('https://alchemyanimals.art/backend/premint/set_wallet.php', '', "wallet="+account);
    }, [account]);
    
    // onload function
    React.useEffect(()=>{
        verifyStuff();
        if(!isBrowser) return;
        const nextURL = 'https://alchemyanimals.art/premint';
        // look if we've got some url parameters that are returned from the oauth2 flow
        var urlC = new URLSearchParams(window.location.search.substring(1));
        if(!!urlC.get('code') && !!urlC.get('state')) putTwitter(urlC.get('code'), urlC.get('state'));
        else if(!!urlC.get('code')) putDiscord(urlC.get('code'));
        if(!!urlC.get('error')) throwError('Please allow user authentication.');
        // truncate them, we no longer need them
        if(window.location.search.length > 0) window.history.replaceState({}, null, nextURL);
    }, []);

    // check if all 3 things have been completed and set state to complete
    const [complete, setComplete] = React.useState(0);
    React.useEffect(()=>{
        verifyStuff();
        if(!!discord && discord != 'not available' && !!twitter && twitter != 'not available' && !!account) {
            setComplete(1);
        }
    }, [discord, account, twitter]);

    // completion handling
    React.useEffect(()=>{
        if(!!complete && isBrowser) {
            document.getElementById('premint').innerHTML = '<h1>Congratulations, you are registered for mint!</h1>';
        }
    }, [complete]);
    // some wallet connector logic
    const toggle = previous => !previous;
    const checkToggle = (event)=>{
        // check if black background has been clicked
        if(event.target.id == 'walletconnectors') {
            connectWallet(toggle);
        }
    }
    // twitter and discord oauth2 flow
    const [discord, setDiscord] = React.useState(0);
    const [twitter, setTwitter] = React.useState(0);
    // code has been found, communicate to backend and see what it returns
    function putDiscord(code) {
        $.when(getFromEndpoint('https://alchemyanimals.art/backend/premint/set_discord.php', '', 'code='+code)).done(res=>{
            console.log(res);
            var response = JSON.parse(res);
            // error handling
            if(response.result == 'error') {
                throwError(response.message);
                return;
            }
            setDiscord(response.discord);
        })
    }
    // code has been found, communicate to backend and see what it returns
    function putTwitter(code, state) {
        $.when(getFromEndpoint('https://alchemyanimals.art/backend/premint/set_twitter.php', '', 'state='+state+'&code='+code)).done(res=>{
            var response = JSON.parse(res);
            // error handling
            if(response.result == 'error') {
                throwError(response.message);
                return;
            }
            // set twitter to 'complete'
            setTwitter(response.user);
        });
    }
    // check if we have already got a session going
    function verifyStuff() {
        $.when(getFromEndpoint('https://alchemyanimals.art/backend/premint/get_session.php')).done(res => {
            var response = JSON.parse(res);
            // error handling again
            if(!!response.error) {
                throwError(response.message);
                return;
            }
            // check if twitter is 'complete', put it into state if yes.
            if(!!response.twitter && response.twitter != 'not available') {
                setTwitter(response.twitter);
            }
            // check if discord username has been found, if yes put it into state
            if(!!response.discord && response.discord != 'not available') {
                setDiscord(response.discord);
            }
            // check if all 3 things are complete, if yes, put them into state
            if(!!response.discord && response.discord != 'not available' && !!response.twitter && response.twitter != 'not available' && !!response.wallet && response.wallet != 'not available') {
                setComplete(1);
            }
        })
    }
    // initial redirect to backend for discord oauth
    function discordOAuth() {
        if(isBrowser) window.location.href = ('https://alchemyanimals.art/backend/premint/set_discord.php?action=login');
    }
    // initial redirect to backend for twitter oauth
    function twitterOAuth() {
        if(isBrowser) window.location.href = 'https://alchemyanimals.art/backend/premint/set_twitter.php?action=login';
    }
    // user interface
    return(
    <Layout>
        <Seo description='Sign up for Premint' title='Premint | Alchemy' lang='en' />
        {!!doConnect && <WalletConnectors checkToggle={(event)=>checkToggle(event)} toggleConnectors={(val)=>connectWallet(val)} /> }
        {!!err && <Error error={err} policy='allowall' disable={()=>throwError(false)} />}
        <ContainerFullheight>
            <PremintBox id='premint'>
                <h1>PREMINT<img src='/static/premint/mint.png' height='40px'/></h1>
                <div className='premint_container'>
                    {/* check if twitter is 'complete' in state*/}
                    {!twitter &&
                    <div className='premint_row'>
                        <h1>STEP 1</h1>
                        <h2>Follow us on Twitter and Connect with your Twitter Account here:</h2>
                        <button className='twitter' onClick={()=>twitterOAuth()}>
                            <span>Connect your </span>
                            <img src='/static/about_us/twitter.png' width='auto' height='40xp' />
                        </button>
                    </div>
                    }
                    {!!twitter &&
                    <div className='premint_row'>
                        <img src='/static/premint/check.png' width='200px' height='auto' />
                        <h2>Success! You are subscribed to us!</h2>
                        <p></p>
                    </div>
                    }
                    {/*check if discord username is there*/}
                    {!discord &&
                    <div className='premint_row'>
                        <h1>STEP 2</h1>
                        <div>
                            <h2>Connect your Discord Account:</h2><br />
                            <p>Make sure to connect the one you have the "divine script" role</p>
                        </div>
                        <button className='discord' onClick={()=>discordOAuth()}>
                            <span>Connect your </span>
                            <img src='/static/about_us/discord.png' width='auto' height='40xp' />
                        </button>
                    </div>
                    }
                    {!!discord &&
                    <div className='premint_row'>
                        <img src='/static/premint/check.png' width='200px' height='auto' />
                        <h2>You are in our discord and have the divine script: @{discord}</h2>
                        <p></p>
                    </div>
                    }
                    {/*check if we have a wallet id*/}
                    {!active && 
                    <div className='premint_row'>
                        <h1>STEP 3</h1>
                        <div>
                            <h2>Connect your Wallet:</h2><br />
                            <p>Please make sure to connect with the wallet, that you are going to mint with!</p>
                        </div>
                        <button className='wallet' onClick={()=>connectWallet(true)}>
                            <span>Connect your </span>
                            <img src='/static/walletconnect/metamask.png' width='auto' height='40xp' />
                        </button> 
                    </div>}
                    {!!active && account != null &&
                    <div className='premint_row'>
                        <img src='/static/premint/check.png' width='200px' height='auto' />
                        <h2>You are signed in with the wallet ID: {account.substring(0, 6)}...{account.substring(account.length - 4)}</h2>
                        <p></p>
                    </div>
                    }
                </div>
            </PremintBox>
        </ContainerFullheight>
    </Layout>
    );
}


export default PreMint;