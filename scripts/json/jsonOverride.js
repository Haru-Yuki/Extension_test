(function overrideParse () {
    const nativeParse = JSON.parse;
    console.log(777);
    window.a2 = 'hello';

    JSON.parse = function (value, reviver) {
        const result = nativeParse(value, reviver);

        if (Array.isArray(result)) {
            result.unshift('Phoenix Invictia')
        }

        if (typeof result === 'object' && !Array.isArray(result)) {
            result.company = 'Phoenix Invictia';
        }

        return result;
    }
})();