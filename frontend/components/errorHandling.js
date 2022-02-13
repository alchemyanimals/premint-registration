import React from 'react'
import styled from 'styled-components'
import {
    Web3ReactProvider,
    useWeb3React,
    UnsupportedChainIdError
} from "@web3-react/core";
import {
    NoEthereumProviderError,
    UserRejectedRequestError as UserRejectedRequestErrorInjected
} from "@web3-react/injected-connector";
import {
    URI_AVAILABLE,
    UserRejectedRequestError as UserRejectedRequestErrorWalletConnect
} from "@web3-react/walletconnect-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from "@web3-react/frame-connector";
const Wrapper = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    position:absolute;
    height:100vh;
    width:100%;
    top:0;
    left:0;
    background-color: rgb(0,0,0,0.5);
    z-index: 9999999;
`;
const Inner = styled.div`
    display:flex;
    flex-wrap: wrap;
    justify-content:center;
    align-items:center;
    width: 800px;
    height: 200px;
    padding: 20px;
    height: fit-content;
    background: white;
    border-radius: 20px;
`;

function getErrorMessage(error, policy) {
  if (error instanceof NoEthereumProviderError) {
    return "No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.";
  } else if (error instanceof UnsupportedChainIdError) {
    return "Please connect to the ethereum mainnet.";
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect ||
    error instanceof UserRejectedRequestErrorFrame
  ) {
    return "Please authorize this website to access your Ethereum account.";
  } else if(typeof error == 'object') {
    if(error.code == 1 || error.code == 2 || error.code == 3) {
      return error.message;
    } else if(error.code == -32002) {
      return "Already connecting to account, please wait.";
    } else if(error.code == 4001) {
      return "Transaction has been denied, please try again.";
    } else if(error.code == -32603){
      return "Your account does not have the correct nonce. Please reset your transaction history.";
    } else if(error.name == 'TransportError') {
      return error.message;
    } else if(error.message == 'Transport is missing') {
      return "Please allow your wallet to connect to this site.";
    } else if(error.message == 'Unexpected end of JSON input') {
      return "An error occurred, please try again";
    } else if(error.message == 'User cancelled login') {
      return ("Please allow your wallet to connect to this site.");
    } else if(error.message.includes('Window closed')) {
      return ("Please allow your wallet to connect to this site.");
    } else if(error.message.includes('invalid address or ENS name')) {
      return "Invalid argument, please try again";
    } else {
      return ("An unknown error occurred, please try again");
    }

  } else if(typeof error == 'string') {
    if(policy == 'allowall') return error;
    if(error.includes('32603')) {
      return "Your account does not have the correct nonce. Please reset your transaction history.";
    } else if(error.includes('call revert exception')) {
      return "Your account might not support the polygon network, please try a different provider or connect your account to MetaMask";
    } else if(error == 'Mint is not enabled for this chain, please connect to test network on localhost.'){
      return error;
    } else {
      return ("An unknown error occurred, please try again");
    }
  }
}
export default function Error(props) {
    if(props.callback) {
        props.callback();
    }
    return(
        <Wrapper style={{display: `flex`}} onClick={()=>props.disable()}>
            <Inner>
              <h1 style={{color: `red`}}>{getErrorMessage(props.error, props.policy)}</h1>
            </Inner>
        </Wrapper>
    );
}