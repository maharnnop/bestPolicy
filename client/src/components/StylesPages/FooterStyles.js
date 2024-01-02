import styled from "styled-components";

export const FooterBody = styled.div `
    z-index: -1000;
    background-color: #05276B;
    position: absolute;
    height: 200px;
    width: 100%;
    display: flex;
    padding: 0.2rem calc((100vw - 1700px) / 2);
`

export const FooterGrid = styled.div `
 
    position: relative;
    width: 100%;
    display: grid;
    grid-template-columns: 25% 25% 25% 25%;
`

export const FooterGridBox = styled.div `

margin: 0px;
    padding: 25px;
    display: flex-box;
    justified-content: flex-start;
    text-align: left;
    position: relative;
`

export const FooterTopic = styled.h3 `

    margin: 0px;
    padding: 0px 10px 10px 0px;
    color: #fff;
    font-size: 15px;
`

export const FooterTxt = styled.p `

    color: #fff;
    margin: 0px;
    padding: 0px 10px 10px 0px;
    font-size: 12px;
`