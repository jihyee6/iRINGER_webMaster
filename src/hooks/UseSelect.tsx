import { useState } from 'react';

export const UseSelect = () => {
    const [Selected, setSelected] = useState("-1");

    const handleSelect = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setSelected(e.target.value)
    }

    return { Selected, handleSelect };
}