import { useState, useEffect } from 'react';

type checkbox = {
    value: any;
    onChange: (checked: boolean, item: any) => void;
    checked: boolean;
}

export function UseCheckbox({ value, checked, onChange }: checkbox) {

    return (
        <input type="checkbox" name="_checkbox" value={value} checked = {checked} onChange={(e) => {onChange(e.target.checked, e.target.value)}} />
    );

}

type all_checkbox = {
    onChange: (checked: boolean) => void;
    checked: boolean;
}

export function UseAllCheckbox({ onChange, checked }: all_checkbox) {

    return (
        <input type="checkbox" name="_checkbox" checked = {checked} onChange={(e) => {onChange(e.target.checked)}} />
    );

}

