(() => {
    //////////////////////////////////////////////////////////////////////////////////////
    ///                                                                                ///
    ///  STATION LOGO INSERT SCRIPT FOR FM-DX-WEBSERVER (V3.6a)                        ///
    ///                                                                                ///
    ///  Thanks to Ivan_FL, Adam W, mc_popa, noobish & bjoernv for the ideas/design    ///
    ///  and AmateurAudioDude for the code customizations!                             ///
    ///                                                                                ///
    ///  New Logo Files (png/svg) and Feedback are welcome!                            ///
    ///  73! Highpoint                                                                 ///
    ///                                                   	 last update: 04.07.24     ///
    ///                                                                                ///
    //////////////////////////////////////////////////////////////////////////////////////

    const pluginSetupOnlyNotify = true;
    const CHECK_FOR_UPDATES = true;;

    //////////////////////////////////////////////////////////////////////////////////////

    // Define local version and Github settings

    const pluginVersion = '3.6a';
    const pluginName = "Station Logo";
    const pluginHomepageUrl = "https://github.com/nuscarrick/webserver-station-logos/releases";
    const pluginUpdateUrl = "https://raw.githubusercontent.com/nuscarrick/webserver-station-logos/main/StationLogo/updateStationLogo.js";
    const countryListUrl = 'https://tef.noobish.eu/logos/scripts/js/countryList.js';
    const logoBaseURL = 'https://api.fmlist.org/fmscan.com/logobystation.php';

    window.countryList = window.countryList || [];
    $.getScript(countryListUrl)
      .done(() => console.log('countryList loaded successfully.'))
      .fail(() => {
        console.error('Failed to load countryList – falling back to empty list.');
        window.countryList = []; // ensure it's still an array

      });

    let isTuneAuthenticated;

    // Function for update notification in /setup
    function checkUpdate(setupOnly, pluginName, urlUpdateLink, urlFetchLink) {

        if (setupOnly && window.location.pathname !== '/setup') return;
        let pluginVersionCheck = typeof pluginVersion !== 'undefined' ? pluginVersion : typeof plugin_version !== 'undefined' ? plugin_version : typeof PLUGIN_VERSION !== 'undefined' ? PLUGIN_VERSION : 'Unknown';

        // Function to check for updates
        async function fetchFirstLine() {
            const urlCheckForUpdate = urlFetchLink;

            try {
                const response = await fetch(urlCheckForUpdate);
                if (!response.ok) {
                    throw new Error(`[${pluginName}] update check HTTP error! status: ${response.status}`);
                }

                const text = await response.text();
                const lines = text.split('\n');

                let version;

                if (lines.length > 2) {
                    const versionLine = lines.find(line => line.includes("const pluginVersion =") || line.includes("const plugin_version =") || line.includes("const PLUGIN_VERSION ="));
                    if (versionLine) {
                        const match = versionLine.match(/const\s+(?:pluginVersion|plugin_version|PLUGIN_VERSION)\s*=\s*['"]([^'"]+)['"]/);
                        if (match) {
                            version = match[1];
                        }
                    }
                }

                if (!version) {
                    const firstLine = lines[0].trim();
                    version = /^\d/.test(firstLine) ? firstLine : "Unknown"; // Check if first character is a number
                }

                return version;
            } catch (error) {
                console.error(`[${pluginName}] error fetching file:`, error);
                return null;
            }
        }

        // Check for updates
        fetchFirstLine().then(newVersion => {
            if (newVersion) {
                if (newVersion !== pluginVersionCheck) {
                    let updateConsoleText = "There is a new version of this plugin available";
                    // Any custom code here

                    console.log(`[${pluginName}] ${updateConsoleText}`);
                    setupNotify(pluginVersionCheck, newVersion, pluginName, urlUpdateLink);
                }
            }
        });

        function setupNotify(pluginVersionCheck, newVersion, pluginName, urlUpdateLink) {
            if (window.location.pathname === '/setup') {
              const pluginSettings = document.getElementById('plugin-settings');
              if (pluginSettings) {
                const currentText = pluginSettings.textContent.trim();
                const newText = `<a href="${urlUpdateLink}" target="_blank">[${pluginName}] Update available: ${pluginVersionCheck} --> ${newVersion}</a><br>`;

                if (currentText === 'No plugin settings are available.') {
                  pluginSettings.innerHTML = newText;
                } else {
                  pluginSettings.innerHTML += ' ' + newText;
                }
              }

              const updateIcon = document.querySelector('.wrapper-outer #navigation .sidenav-content .fa-puzzle-piece') || document.querySelector('.wrapper-outer .sidenav-content') || document.querySelector('.sidenav-content');

              const redDot = document.createElement('span');
              redDot.style.display = 'block';
              redDot.style.width = '12px';
              redDot.style.height = '12px';
              redDot.style.borderRadius = '50%';
              redDot.style.backgroundColor = '#FE0830' || 'var(--color-main-bright)'; // Theme colour set here as placeholder only
              redDot.style.marginLeft = '82px';
              redDot.style.marginTop = '-12px';

              updateIcon.appendChild(redDot);
            }
        }
    }

    if (CHECK_FOR_UPDATES) checkUpdate(pluginSetupOnlyNotify, pluginName, pluginHomepageUrl, pluginUpdateUrl);

    const stationLogoPopupHTML = `
        <div class="popup-window" id="popup-panel-station-logo">
          <div class="flex-container flex-column flex-phone flex-phone-column" style="height: calc(100%);">
            <div class="popup-header hover-brighten flex-center">
              <p class="color-4" style="margin: 0; padding-left: 10px;">İstasyon Logosu</p>
              <button class="popup-close">✖</button>
            </div>
            <div class="popup-content text-left flex-container flex-phone flex-column" style="flex: 1;">
                <img id="large-station-logo" alt="station-logo" style="width: 300px">
            </div>
          </div>
        </div>
        <style>
            #popup-panel-station-logo {
                width: 300px !important;
                height: auto !important;
            }
        </style>
    `;
    $('.wrapper-outer.main-content').append(stationLogoPopupHTML);
    //////////////// Insert logo code for desktop devices ////////////////////////

    // Define the HTML code as a string for the logo container
    var LogoContainerHtml = '<div style="width: 5%;"></div> <!-- Spacer -->' +
        '<div class="panel-30 m-0 hide-phone" style="width: 48%" >' +
        '    <div id="logo-container-desktop" style="width: 215px; height: 60px; display: flex; justify-content: center; align-items: center; margin: auto;">' +
        '        <img id="station-logo" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC" alt="station-logo-desktop" style="max-width: 140px; max-height: 100%; margin-top: 30px; display: block; cursor: pointer;">' +
        '    </div>' +
        '</div>';
    // Insert the new HTML code after the named <div>
    document.getElementById("ps-container").insertAdjacentHTML('afterend', LogoContainerHtml);

    // The new HTML code for the <div> element with the play / stop button
    var buttonHTML = '<div class="panel-10 no-bg h-100 m-0 m-right-20 hide-phone" style="width: 80px;margin-right: 20px !important;">' +
                         '<button class="playbutton" aria-label="Play / Stop Button"><i class="fa-solid fa-play fa-lg"></i></button>' +
                      '</div>';
    // Select the original <div> element
    var originalDiv = document.querySelector('.panel-10');
    // Create a new <div> element
    var buttonDiv = document.createElement('div');
    buttonDiv.innerHTML = buttonHTML;
    // Replace the original <div> element with the new HTML
    originalDiv.outerHTML = buttonDiv.outerHTML;

    //////////////// Insert logo code for mobile devices ////////////////////////

    // Select the existing <div> element with the ID "flags-container-phone"
    var flagsContainerPhone = document.getElementById('flags-container-phone');

    // Create the new HTML code for the replacement
    var MobileHTML = `
        <div id="flags-container-phone" class="panel-33 user-select-none">
            <h2 class="show-phone">
                <div id="logo-container-phone" style="width: auto; height: 70px; display: flex; justify-content: center; align-items: center; margin: auto;">
                    <img id="station-logo-phone" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAAtJREFUGFdjYAACAAAFAAGq1chRAAAAAElFTkSuQmCC" alt="station-logo-phone" style="max-width: 160px; padding: 1px 2px; max-height: 100%; margin-top: 0px; display: block;">
                </div>
                <br>
                <div class="data-pty text-color-default"></div>
            </h2>
            <h3 style="margin-top:0;margin-bottom:0;" class="color-4 flex-center">
                    <span class="data-tp">TP</span>
                    <span style="margin-left: 15px;" class="data-ta">TA</span>
                    <div style="display:inline-block">
                        <span style="margin-left: 20px;display: block;margin-top: 2px;" class="data-flag"></span>
                    </div>
                    <span class="pointer stereo-container" style="position: relative; margin-left: 20px;" role="button" aria-label="Stereo / Mono toggle" tabindex="0">
                        <div class="circle-container">
                            <div class="circle data-st circle1"></div>
                            <div class="circle data-st circle2"></div>
                        </div>
                        <span class="overlay tooltip" data-tooltip="Stereo / Mono toggle. <br><strong>Click to toggle."></span>
                    </span>
                    <span style="margin-left: 15px;" class="data-ms">MS</span>
            </h3>
        </div>
    `;

    // Replace the HTML content of the <div> element with the new HTML code
    flagsContainerPhone.innerHTML = MobileHTML;

    var logoImage;
    if (window.innerWidth < 768) {
        logoImage = $('#station-logo-phone');
    } else {
        logoImage = $('#station-logo');
    }

    // Function to update the station logo based on various parameters
    function updateStationLogo(piCode, ituCode, Program, frequency) {
        const logoURL = getStationLogoURL(piCode, frequency, 64);
        const largeLogoURL = getStationLogoURL(piCode, frequency, 300);
        logoImage.attr('src', logoURL).css('cursor', 'pointer');
        logoImage.off('click');
        logoImage.on('click', () => {
            $('#large-station-logo').attr('src', largeLogoURL);
            $('#popup-panel-station-logo').resizable("disable");
            togglePopup('#popup-panel-station-logo');
        });
    }

    function getStationLogoURL(piCode, frequency, size) {
        return `${logoBaseURL}?fx=${frequency}&pi=${piCode === '?' ? 0 : piCode}&size=${size}&pos=${localStorage.getItem('qthLatitude')},${localStorage.getItem('qthLongitude')}`;
    }

    let lastLogoState = {
        piCode: null,
        ituCode: null,
        Program: null,
        frequenz: null,
        psCode: null
    };

    let lastProcessedTime_Station = 0;
    let executeStationLogo = false;

    const TIMEOUT_DURATION_STATION = 75;

    window.addEventListener('DOMContentLoaded', () => {
        executeStationLogo = true;
        connectWebSocket_StationLogo();
    });

    function connectWebSocket_StationLogo() {
        if (!window.socket || window.socket.readyState === WebSocket.CLOSED || window.socket.readyState === WebSocket.CLOSING) {
            try {
                window.socket = new WebSocket(socketAddress);
                console.log('Station Logo: Attempting to create WebSocket...');
            } catch (e) {
                console.error('Station Logo: Failed to create WebSocket:', e);
                return;
            }
        } else if (window.socket.readyState === WebSocket.OPEN) {
            console.log('Station Logo: WebSocket already open.');
        }

        window.socket.removeEventListener('message', handleStationLogoUpdate);
        window.socket.removeEventListener('close', onSocketClose);
        window.socket.removeEventListener('error', onSocketError);

        window.socket.addEventListener('message', handleStationLogoUpdate);
        window.socket.addEventListener('close', onSocketClose);
        window.socket.addEventListener('error', onSocketError);
    }

    function onSocketClose() {
        setTimeout(() => {
            console.log('Station Logo: WebSocket closed. Attempting to reconnect...');
            connectWebSocket_StationLogo();
        }, 10000);
    }

    function onSocketError() {
        console.warn('Station Logo: WebSocket error. Attempting to reconnect...');
        setTimeout(connectWebSocket_StationLogo, 10000);
    }

    function handleStationLogoUpdate(event) {
        const now = Date.now();
        if (now - lastProcessedTime_Station < TIMEOUT_DURATION_STATION) return;
        lastProcessedTime_Station = now;

        try {
            const data = JSON.parse(event.data);
            const piCode   = data.pi?.toUpperCase();
            const ituCode  = data.txInfo?.itu?.toUpperCase();
            const Program  = data.txInfo?.tx?.replace(/%/g, '%25');
            const frequenz = data.freq;
            const psCode   = data.ps;

            if (
                executeStationLogo && (
                    piCode !== lastLogoState.piCode ||
                    ituCode !== lastLogoState.ituCode ||
                    Program !== lastLogoState.Program ||
                    frequenz !== lastLogoState.frequenz ||
                    psCode !== lastLogoState.psCode
                )
            ) {
                updateStationLogo(piCode, ituCode, Program, frequenz);
                lastLogoState = { piCode, ituCode, Program, frequenz, psCode };
            }

        } catch (err) {
            console.error('Station Logo: Failed to parse WebSocket message', err);
        }
    }
})();
