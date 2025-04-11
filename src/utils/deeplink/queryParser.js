// utils/queryParser.js
export const parseQueryString = (queryString) => {
    if (!queryString) return {};
    const params = {};
    const pairs = queryString.split('&');
    pairs.forEach((pair) => {
        const [key, value] = pair.split('=');
        if (key && value) {
            params[key] = decodeURIComponent(value);
        }
    });
    return params;
};