import React, { PropsWithChildren } from "react";
import styled from "styled-components";
import Button from "components/public/button";
import { MemoSideModal } from 'components/public/sideModal';
import { MemoSideModalContents } from "components/public/sideModalContents";

interface ModalDefaultType {
  onClickToggleModal: () => void;
  width: number;
  height?: number;
  sideModal: () => void | undefined;
  sideIsOpen?: boolean;
  sideModalType?: string;
}

function Modal({onClickToggleModal, width, height, children, sideModal, sideIsOpen, sideModalType }: PropsWithChildren<ModalDefaultType>) {

  return (
    <ModalContainer>
      {sideIsOpen && (
        <MemoSideModal onClickToggleModal={sideModal} width = {360} height = {860} fake = {true}>
        </MemoSideModal>
      )}
      <DialogBox width = {width} height = {height}>{children}</DialogBox>
      <Backdrop
        /* onClick={(e: React.MouseEvent) => {
          e.preventDefault();

          if (onClickToggleModal) {
            onClickToggleModal();
          }
        }} */
      />
      {sideIsOpen && (
        <MemoSideModal onClickToggleModal={sideModal} width = {360} height = {860} fake = {false}>
          <MemoSideModalContents closeModal={sideModal} sideModalType = {sideModalType}/>
        </MemoSideModal>
      )}
    </ModalContainer>
  );
}

const ModalContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
`;

const DialogBox = styled.div<{width: number, height?: number}>`
  width: ${(props) => (props.width)}px;
  height: ${(props) => (props.height)}px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: #34424F;
  z-index: 10000;
`;

const Backdrop = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.55);
`;

export const MemoModal = React.memo(Modal);

type modal_head = {
  name: string;
  closeType: string;
  closeModal?: () => void;
}

function ModalHead({name, closeType, closeModal}: modal_head) {

  let name_class = "info_name";
  let close_class = "modal_close_btn";

  if(closeType === "c") {
    name_class = "side_info_name";
    close_class = "side_modal_close_btn";
  }

  return (
    <div className = {"modal_head" + (closeType === "c" ? " border_b" : "")}>
      <div className= {name_class}>{name}</div>
      <div className = "modal_close">
          <div className = {close_class} onClick = {closeModal}>
            { closeType === "x" ?
              <span>x</span>
              :
              <span>닫기</span>
            }
          </div>
      </div>
    </div>
  )

}

export const MemoModalHead = React.memo(ModalHead);

type modal_foot = {
  name: string;
  btn_size: string;
  closeModal?: () => void;
  onClick?: React.Dispatch<React.SetStateAction<boolean>>;
  plus?: () => void;
}

function ModalFoot({name, btn_size, closeModal, onClick, plus}: modal_foot) {
  
  const ClickBtn = () => {

    if(onClick) {
      onClick(true);
    }  
    
    if(plus){
      plus();
    }

  }

  return (
    <div className = "modal_btn_wrapper">
      { onClick ?
        <Button name={name} size={btn_size} onClick = {ClickBtn} />
        :
        <Button name={name} size={btn_size} onClick = {closeModal} />
      }
    </div>
  )

}

export const MemoModalFoot = React.memo(ModalFoot);