export const isEmptyObject = (obj) => {
    for (const key in obj) {
        if (key) {
            if (obj.hasOwnProperty(key)) {
                return false;

            }
        }
    }
    return true;
};

