module.exports = (array) => {
    const obj = {};
    array.map((value) => {
        obj[value.key] = value.value;
    });
    return obj;
};
