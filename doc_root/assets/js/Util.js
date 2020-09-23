export const asyncDelay = function(timeout) {
    return new Promise((resolve, reject) => setTimeout(resolve, timeout));
};
