function injectCode(src) {
    const script = document.createElement('script');

    script.src = src;

    script.innerHTML = `
    const a = 777;
    console.log(a);
    `;

    script.onload = function() {
        this.remove();
    };

    const nullThrows = (v) => {
        if (v == null) throw new Error("it's a null");
        return v;
    }

    nullThrows(document.head || document.documentElement).appendChild(script);
}

injectCode(chrome.runtime.getURL('./scripts/json/json.js'));