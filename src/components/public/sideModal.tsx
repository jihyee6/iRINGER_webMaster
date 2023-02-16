import React, { PropsWithChildren } from "react";
import styled from "styled-components";

interface ModalDefaultType {
  onClickToggleModal?: () => void;
  width: number;
  height?: number;
  fake: boolean;
}

function SideModal({onClickToggleModal, width, height, children, fake}: PropsWithChildren<ModalDefaultType>) {

  let background_color = "#232D37"
  if(fake) {
    background_color = "transparent"
  }

  return (
    <ModalContainer>
      <DialogBox width = {width} height = {height}  background = {background_color}>{children}</DialogBox>
      {!fake && 
        <Backdrop
          /* onClick={(e: React.MouseEvent) => {
            e.preventDefault();

            if (onClickToggleModal) {
              onClickToggleModal();
            }
          }} */
        /> 
      }
    </ModalContainer>
  );
}

const ModalContainer = styled.div`
  
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
  top: 0;
  left: 0;
`;

const DialogBox = styled.div<{width: number, height?: number, background: string}>`
  width: ${(props) => (props.width)}px;
  height: ${(props) => (props.height)}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: ${(props) => (props.background)};
  z-index: 10000;
`;

const Backdrop = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
`;

export const MemoSideModal = React.memo(SideModal);