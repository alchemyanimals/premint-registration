import React from 'react'
import $ from 'jquery'
import { isBrowser } from 'browser-or-node';
import styled from 'styled-components';
import gsap from 'gsap'

const Tooltip = styled.div`
  visibility: hidden;
  padding: 5px 10px;
  z-index: 99;
  background: rgb(255, 255, 255, 0.7);
  position: absolute;
  transform: translate(-50%, 100%);
`;


function Layout({children}) {
  React.useEffect(()=>{
    if(!isBrowser) return;
    var tooltipElement = document.getElementById('tooltip');
    var tooltips = $('*[tooltip]');
    tooltips.each((i, obj) => {
      $(obj).mousemove(function(event){
        gsap.to(tooltipElement, {x: event.pageX, y: event.pageY-tooltipElement.clientHeight-20, duration: 0});
        tooltipElement.style.visibility = 'visible';
        tooltipElement.innerHTML = obj.getAttribute('tooltip');
      });
      obj.addEventListener('mouseleave', (event)=>{
        tooltipElement.style.visibility = 'hidden';
      });
      if(obj.getAttribute('tooltip').includes('@')) {
        obj.addEventListener('click', ()=>{
          window.open('https://twitter.com/'+obj.getAttribute('tooltip').substring(1));
        });
      }
    });
    window.onscroll = ()=>{};
    document.querySelectorAll('.fake-scroll').forEach(fake =>{
      fake.remove();
    });
    document.querySelector('body').style.overflow = 'auto';
  }, []);

  return(
    <div>
      <Tooltip id='tooltip'></Tooltip>
      {children}
    </div>
  );
}
export default Layout;