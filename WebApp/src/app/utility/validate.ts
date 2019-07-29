export const validate = (data, field, type, typeOptions = null) => {
    let isError = false;
    const value = data[field];
    if (type === 'required') {
        if (!value) {
            isError = true;
        }
    } else if (type === 'format') {
        if (typeOptions.indexOf('unsigned') !== -1) {
            isError = (!isNaN(value) && value.indexOf('.') === -1) ? false : true;
        } else if (typeOptions === 'float') {
            isError = !isNaN(value) ? false : true;
        }
    } else if (type === 'range') { // range check
        if (typeOptions.dataType.indexOf('unsigned') !== -1 && (parseInt(value, 10) < parseInt(typeOptions.minimum, 10) || parseInt(value, 10) > parseInt(typeOptions.maximum, 10))) {
            isError = true;
        } else if (typeOptions.dataType === 'float' && (parseFloat(value) < parseFloat(typeOptions.minimum) || parseFloat(value) > parseFloat(typeOptions.maximum))) {
            isError = true;
        } else if (typeOptions.dataType.indexOf('string') !== -1 && typeOptions.length !== undefined && typeOptions.length !== '' && value.length > typeOptions.length) {
            isError = true;
        }
    }
    return isError;
};
export const validateField = (data, field, validatorList) => {
    data.error = data.error || {};
    // data.errors = data.errors || [];
    for (let item = 0; item <= validatorList.length - 1;) {
        if (validate(data, field, validatorList[item].type, validatorList[item].typeOptions)) {
            data.error = validatorList[item].message;
            // data.errors.push({ parameterKey: data.parameterKey, error: validatorList[item].type });
            break;
        } else {
            if (data.error !== undefined) {
                delete data.error;
            }
            item++;
        }
    }
    // if (this.isEmpty(data.error) === true) {
    //   delete data.error;
    // }
};
export const getErrorIndex = (item) => {
    const index = item.errors.findIndex(x => x.parameterKey === item.parameterKey);
    return index;
};
