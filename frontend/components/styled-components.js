import styled from 'styled-components'

export const ContainerFullheight = styled.div`
    width: 100%;
    height:100vh;
    display:flex;
    justify-content:center;
    align-items:center;
    background: rgb(20, 20, 20);
`;
export const Inner = styled.div`
    display:flex;
    flex-wrap: wrap;
    justify-content:center;
    align-items:center;
    border-radius: 20px;
    flex-direction:column;
`;
export const Connectors = styled.div`
  display:flex;
  flex-wrap: wrap;
  justify-content:center;
  align-items:center;
  border-radius: 20px;
  flex-direction:column;
  width: 800px;
  height: 600px;
  background: rgb(255,255,255,0.9);
  @media only screen and (max-width: 800px) {
    width: 100%;
    height: 100%;
  }

`
export const Background = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    position:absolute;
    height:100%;
    width:100%;
    top:0;
    left:0;
    background-color: rgb(0,0,0,0.8);
    z-index: 2;
    @media only screen and (max-width: 460px) {
      width: 100%;
      height: 100%;
    }
`;
export const Button = styled.button`
  background: ${props => props.primary ? "transparent" : "white"};
  color: ${props => props.primary ? "white" : "black"};
  font-family: KokoroTrial-Bold, sans-serif;
  border: 4px solid white;
  font-size: 1.2em;
  font-weight: 500;
  padding: 0.8em 1.7em;
  cursor:pointer;
  transition: background-color 0.5s ease;
  &:hover {
    background-color: ${props => props.primary ? "lightgrey": "rgb(220,220,220)"};
    transform: zoom(1.5);
  }
`;

export const Head = styled.header`
  width: calc(100% - 80px);
  padding: 40px 80px;
  display: flex;
  justify-content: space-between;
  position:absolute;
  top: 0;
  left:0;
  @media only screen and (max-width: 460px) {
    width: 100%;
  }
  z-index: 1;
`;

export const Wrapper = styled.div`
  display:flex;
  justify-content: center;
  align-items: center;
`;
export const Panel = styled.div`
    height: calc(600px / 3 - 2*14px);
    width: calc(800px / 4 - 2*19px);
    padding: 10px 15px;
    margin: 3px;
    display:flex;
    justify-content:center;
    align-items:center;
    cursor:pointer;
    border-radius: 20px;
    transition: background-color 0.5s ease;
    text-align:center;
    &:hover {
        background-color: lightgrey;
    }
    @media only screen and (max-width: 800px) {
      width: calc(100% / 3 - 2*12px);
      padding: 10px 10px;
      margin: 2px;
    }
    @media only screen and (max-width: 460px) {
        width: calc(100% / 2 - 2*7px);
        padding: 10px 6px;
        margin: 1px;
        height: calc(100% / 5 - 2*18px);
    }

`;
export const ConnectorItem = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items:center;
    &>*{
        margin: 10px 0;
    }
    @media only screen and (max-width: 460px) {
        &>p {
            display: none;
        }
    }
`;

export const ImgWrap = styled.div`
    display:flex;
    justify-content:center;
    align-items:center;
    width: 100%;
`;
export const ThreeColumns = styled.div`
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
    @media only screen and (max-width: 990px) {
      flex-direction: column;
    }
`;
export const Column = styled.div`
    width: calc(100% / 3);
    height: 100%;
    display:flex;
    justify-content:center;
    align-items:center;
    flex-direction: column;
    position: relative;
    @media only screen and (max-width: 990px) {
      width: 100%;
      height: calc(100% / 3);
    }
`;
export const Normal = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position:relative;
  &:hover {
    cursor: pointer;
  }
`;
export const Zoom = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  position:relative;
  transition: transform 0.5s ease;
  &:hover {
    cursor: pointer;
    transform: scale(1.001);
  }
`;
export const Wiggle = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  flex-direction: column;
  &>* {
    transition: transform 0.5s ease;
  }
  @media only screen and (max-width: 990px) {
    flex-direction: row;
    &>* {
      transform: translate(0) !important;
      width: 100px;
      height:auto;
    }
  }
`;

export const Modal = styled.div`
  height: 100%;
  width: 100%;
  z-index: 3;
  justify-content:center;
  align-items:center;
  flex-direction: row;
  position: absolute;
  display:flex;
  top: 0;
  left: 0;
  background: rgb(0,0,0, 0.5);
  &>img {
    cursor: zoom-in;
  }
`;
export const ShowCase = styled.div`
  height: 50%;
  width: 0;
  opacity: 0;
  transition: opacity 1s ease, width 1s ease;
  border: 5px solid white;
  overflow: hidden;
  &.show{
    width: fit-content;
    opacity: 1;
  }
  &>img {
    transform: scale(1.5);
  }
`;
export const Trees = styled.div`
  position: fixed;
  display: block;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;
export const Logo = styled.div`
  position: absolute;
  top: 10%;
  left:50%;
  transform: translateX(-50%);
  &>* {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
  z-index: 1;
  @media only screen and (max-width: 500px) {
    top: 15%;
  }
`;