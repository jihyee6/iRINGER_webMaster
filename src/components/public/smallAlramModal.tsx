import React, { PropsWithChildren } from "react";
import styled from "styled-components";

interface ModalDefaultType {
  onClickToggleModal?: () => void;
  width: number;
  height?: number;
}

function SmallModal({onClickToggleModal, width, height, children }: PropsWithChildren<ModalDefaultType>) {


  return (
    <SmallModalContainer>
      <DialogBox width = {width} height = {height} >{children}</DialogBox>
    </SmallModalContainer>
  );
}

const SmallModalContainer = styled.div`
  
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;

`;

const DialogBox = styled.div<{width: number, height?: number }>`
  width: ${(props) => (props.width)}px;
  height: ${(props) => (props.height)}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: #232D37;
  z-index: 10000;
`;

export const MemoSmallAlramModal = React.memo(SmallModal);