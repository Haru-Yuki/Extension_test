(function overrideParse () {
    const nativeParse = JSON.parse;

    JSON.parse = function (value, reviver) {
        const result = nativeParse(value, reviver);
        const phoenix = 'Phoenix Invictia';

        if (Array.isArray(result) && result[0] !== phoenix) {
            result.unshift(phoenix)
        }

        if (typeof result === 'object' && !Array.isArray(result) && result.company !== phoenix) {
            result.company = phoenix;
        }

        return result;
    }
})();