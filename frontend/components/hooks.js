import { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { injected } from "./connectors";
import { useRouter } from "next/router";
import $ from 'jquery'
import { isBrowser } from "browser-or-node";

export function useEagerConnect() {
  const { activate, active } = useWeb3React();

  const [tried, setTried] = useState(false);

  useEffect(() => {
    injected.isAuthorized().then(isAuthorized => {
      if (isAuthorized) {
        activate(injected, undefined, true).catch(() => {
          setTried(true);
        });
      } else {
        setTried(true);
      }
    });
  }, [activate]); // intentionally only running on mount (make sure it's only mounted once :))

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}
export const getFromEndpoint = (url, form='', dataString='') => {
  var data = dataString;
  if(!isBrowser) return;
  if(form != '') {
    var kvpairs = [];
    var formElement = document.forms.namedItem(form);
    for ( var i = 0; i < formElement.elements.length; i++ ) {
      var e = formElement.elements[i];
      kvpairs.push(encodeURIComponent(e.name) + "=" + encodeURIComponent(e.value));
    }
    data = kvpairs.join("&");
  }
  return $.ajax({
    type: "POST",
    url: url,
    data: data
  });
}
export function useInactiveListener(suppress = false, throwError=()=>{}) {
  const { active, error, activate } = useWeb3React();
  useEffect(() => {
    const { ethereum } = window;
    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleChainChanged = chainId => {
        var allowedChains = [137];
        if(!allowedChains.includes(chainId)) {
          throwError({message: "Please connect to the polygon chain.", code:1});
          return;
        }
        activate(injected);
      };
      const handleAccountsChanged = accounts => {
        if (accounts.length > 0) {
          activate(injected);
        } else {
          window.location.href='/';
        }
      };
      const handleNetworkChanged = networkId => {
        var allowedNetworks = [137];
        if(!allowedNetworks.includes(networkId)) {
          throwError({message: "Please connect to the polygon network.", code: 3});
          return;
        }
        activate(injected);
      };

      ethereum.on("chainChanged", handleChainChanged);
      ethereum.on("accountsChanged", handleAccountsChanged);
      ethereum.on("networkChanged", handleNetworkChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener("chainChanged", handleChainChanged);
          ethereum.removeListener("accountsChanged", handleAccountsChanged);
          ethereum.removeListener("networkChanged", handleNetworkChanged);
        }
      };
    }

    return () => {};
  }, [active, error, suppress, activate]);
}

