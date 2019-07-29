
export const getModifiedData = (data, fields, originalField) => {
  if (data && data.length > 0 && fields && fields.length > 0) {
    return data.filter(x => isModified(x, fields, originalField));
  }
  return [];
};

const isModified = (data, fields, originalField) => {
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    if (resolveFieldData(data, field, null) !== resolveFieldData(data[originalField], field, undefined)) {
      return true;
    }
  }
  return false;
};



export const getModifiedDataValues = (data, fields, parallelFields1, parallelFields2, originalData, defaultProperties = null, uniqueKey, resultCallBack) => {
  if (data && data.length > 0 && fields && fields.length > 0) {
    return data.map((x, index) => modifiedDataValues(x, fields, parallelFields1, parallelFields2, originalData.filter(z => z[uniqueKey] === x[uniqueKey])[0], defaultProperties, resultCallBack)).filter(y => y._isModified === true).map((p) => {
      delete p._isModified;
      return p;
    });
  }
  return [];
};

// only resultCallBack function defenition is paassed here;
const modifiedDataValues = (data, fields, parallelFields1, parallelFields2, originalData, defaultProperties, resultCallBack) => {
  let finalResult: any = {};
  const constData: any = {};
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    const parallelField1 = parallelFields1[i];
    const parallelField2 = parallelFields2[i];
    (defaultProperties || []).forEach(element => {
      constData[element] = data[element];
    });
    const value = resolveFieldData(data, field, null);
    const originalValue = (typeof (value) === 'number') ? Number(resolveFieldData(originalData, field, undefined)) : resolveFieldData(originalData, field, undefined);
    const parallelValue1 = resolveFieldData(data, parallelField1, null);
    const parallelValue2 = resolveFieldData(data, parallelField2, null);
    if (value !== originalValue) {
      if (resultCallBack) {
        const result = resultCallBack(data, value, i, parallelValue1, parallelValue2); // invoked here
        finalResult[result.key] = { ...constData, ...result.value };
      } else {
        finalResult = { ...constData, ...data };
      }
      finalResult._isModified = true;
    }
  }
  return finalResult;
};
const resolveFieldData = (data, field, defaultValue = null) => {
  try {
    if (data && field) {
      if (field.indexOf('.') === -1) {
        return data[field];
      } else {
        const fields = field.split('.');
        let value = data;
        for (let i = 0, len = fields.length; i < len; ++i) {
          if (value === null) {
            return defaultValue;

          }
          value = value[fields[i]];
        }
        return value;
      }
    } else {
      return defaultValue;
    }
  } catch (error) {
    return defaultValue;
  }
};
