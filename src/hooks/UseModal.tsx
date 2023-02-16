import {useState, useCallback } from 'react';

export default function UseModal() {

    const [isOpenModal, setOpenModal] = useState<boolean>(false);

    const onClickToggleModal = useCallback(() => {
        setOpenModal(!isOpenModal);
    }, [isOpenModal]);

    return {isOpenModal, setOpenModal, onClickToggleModal};
}
