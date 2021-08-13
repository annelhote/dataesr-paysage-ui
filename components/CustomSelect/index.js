import { useContext, useEffect, useState } from 'react';
import { Select } from '@dataesr/react-dsfr';
import { getUrl } from '../../helpers/constants';
import { useRouter } from 'next/router';
import { AppContext } from '../../context/GlobalState';
import { getUniqueId } from '../../helpers/utils';

export default function CustomSelect({ title, staticValues = [], keyNumber, parentSection }) {
    const { state: { formName, forms, objectStoreName }, dispatch } = useContext(AppContext);
    const [options, setOptions] = useState([]);
    const [selectValue, setSelectValue] = useState('');
    const router = useRouter();
    const uniqueId = getUniqueId(router.pathname, parentSection, title, keyNumber || 0);
    const onSelectChange = (e) => {
        const value = e.target.value;
        const payload = {
            value,
            uid: uniqueId,
            formName
        };
        if (e.target.value) {
            dispatch({ type: 'UPDATE_FORM_FIELD', payload });
        } else {
            dispatch({ type: 'DELETE_FORM_FIELD', payload });
        }
        setSelectValue(value);
    };
    useEffect(() => {
        if (objectStoreName && !selectValue && forms[objectStoreName]) {
            setSelectValue(forms[objectStoreName][uniqueId]);
        }
    }, [forms, objectStoreName, selectValue, uniqueId]);
    useEffect(() => {
        if (!staticValues.length && !options.length) {
            // case no static values
            fetch(getUrl(title))
                .then(res => res.json())
                .then(() => {
                    // fake data
                    const obj = ['f', 'm', 'n'].map((s) => {
                        return { value: s, label: s };
                    });
                    setOptions(obj);
                });
        } else if (!options.length) {
            setOptions(staticValues.map((value) => {
                return { 'value': value, 'label': value };
            }));
            setOptions(prev => [...prev, { value: '', label: 'Select an option' }]);
        }
    }, [options, setOptions, staticValues, title]);
    return (
        <section className="wrapper-select py-10">
            <Select
                data-field={uniqueId}
                onChange={(e) => onSelectChange(e)}
                selected={selectValue}
                label={title}
                options={options}
            />
        </section>
    );
}
