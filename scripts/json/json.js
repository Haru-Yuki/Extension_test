const overrideScript = document.createElement("script");
overrideScript.setAttribute('src', '') = `(${overrideParse})();`
document.body.insertAdjacentElement('beforeend', overrideScript);