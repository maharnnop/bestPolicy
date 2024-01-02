import styled from "styled-components";

export const HeaderProfile = styled.h1 `
    color: #05276B;
    padding-bottom: 7px;
`
export const EditBtn = styled.button `
    border: none;
    height: 35px;
    width: 200px;
    margin-top: 15px;
    margin-bottom: 15px;
    border-radius: 20px;
    background: #3A0CD2;
    color: white;
    cursor: pointer;
    z-index: 10;
`
export const Border = styled.div `
    border: 5px solid #3A0CD2;
    max-width: 690px;
    margin: 30px auto;
    padding: 2px 10px 15px 10px;
    border-radius: 20px;
`
export const ContainerFlex =  styled.div `
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
`
export const InputBox = styled.div `
    width: calc(100% / 2 - 20px);
`
export const Label = styled.p `
    text-align: left;
    margin: 0px;
    font-weight: 500;
`
export const InputBtnProfile = styled.input `
    border: none;
    border-radius: 20px;
    background: #DED5FE;
    color: black;
    height: 35px;
    width: 100%;
    margin-bottom: 8px;
    z-index: 10;

`