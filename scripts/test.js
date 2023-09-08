(function checkElem() {
    const observer = new MutationObserver(function (mutations, mutationInstance) {
        const scriptElem = document.querySelector('#contents');
        const styleElem = document.head;

        if (scriptElem && styleElem) {
            addScript(scriptElem);
            addStyles(styleElem);

            mutationInstance.disconnect();
        }
    });

    observer.observe(document, {
        childList: true,
        subtree: true
    });

    function addScript(scriptElem) {
        const promoWindow = document.querySelector('#promo-window');

        if (promoWindow) {
            return;
        }

        const promo = document.createElement('div');
        promo.setAttribute('id', 'promo-window');
        promo.className = 'promo-window';

        const promoConfig = {
            header: 'Promo test',
            text: 'Promo test text. Please buy a full version, trial has ended.',
            buttonText: 'Close'
        };

        promo.innerHTML = `
        <header>
            <h3 class="promo-header">${promoConfig.header}</h3>
        </header>
        <main class="promo-main">
          <section class="promo-section">
              <p class="promo-text">${promoConfig.text}</p>
              <button id="promo-close">${promoConfig.buttonText}</button>
          </section>
        </main>
    `;

        scriptElem.insertAdjacentElement('afterbegin', promo);

        const promoClose = document.querySelector('#promo-close');

        promoClose.addEventListener('click', function closePromo() {
            const promoWindow = document.querySelector('#promo-window');
            promoWindow.remove();

            promoClose.removeEventListener('click', closePromo);
        });

        (function removeScripts() {
            document.querySelectorAll('.promo-script')
                .forEach((script) => {
                    script.remove();
                })
        })();
    }

    function addStyles(styleElem) {
        const styleId = 'promo';

        const promoStyles = `
      .${styleId}-window {
        position: relative;
        text-align: center;
        color: white;
        width: 400px;
        height: 200px;
        border: 3px solid white;
        margin: 20px;
        border-radius: 10px;
      }
      .${styleId}-header {
        font-size: 36px;
      }
      .${styleId}-text {
          font-size: 24px;
      }
      #${styleId}-close {
          position: absolute;
          bottom: 0;
          right: 0;
      }
    `;

        if (document.querySelector('#promo-styles')) {
            return;
        }

        const styles = document.createElement('style');
        styles.innerHTML = promoStyles;
        styles.setAttribute('id', 'promo-styles');

        styleElem.appendChild(styles);
    }
})();