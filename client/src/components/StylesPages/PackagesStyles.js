import styled from "styled-components";

export const BoxCard = styled.div `
    border-radius: 30px;
    box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
    margin: 30px;
`

export const ImgPackage = styled.img `
    width: 100%;
    position: relative;
    border-radius: 30px 30px 0px 0px;
`

export const GridArea = styled.div `
    position: relative;
    display: grid;
    grid-template-columns: 45% 55%;
    padding: 0px 30px 30px 30px;
    @media screen and (max-width: 768px) {
        display: flex;
    }
`

export const GridBox = styled.div `
    padding: 20px; 
`

export const TxtLorem = styled.p `
    text-align: left;
`

export const H1 = styled.h1 `
    color: #05276B;
    text-transform: uppercase;
    letter-spacing: 1px;
`

export const H2UpperCase = styled.h2 `
    color: #05276B;
    text-transform: uppercase;
    font-size: 22px;
`
export const H2 = styled.h2 `
    color: #05276B;
`

export const H3 = styled.h3 `
    color: #05276B;
`

export const BuyBtn = styled.input `
    background-color: #05276B;
    color: #fff;
    border-radius: 8px;
    margin-left: 5px;
    border: 1px solid #05276B;
`

export const CarList = styled.select `
    border-radius: 8px;
    background-color: #ded5fe;
`
export const Option = styled.option `
    background-color: #ded5fe; 
`