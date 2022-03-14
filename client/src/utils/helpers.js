export const formatPrice = (number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: ' USD'
    }).format(number)/100;
}

export const getUniqueValues = (data, prop) => {
    let unique =[];
    data.forEach((item) => {
        if (item[prop] && item[prop].length > 0) {
            unique.push(item[prop]);
        }
    });
    return ['all', ...new Set(unique)];
}
