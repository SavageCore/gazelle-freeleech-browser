// ==UserScript==
// @name           Gazelle Freeleech Browser
// @author         SavageCore
// @namespace      https://savagecore.eu
// @description    Inserts a logchecker.php link in main menu.
// @include        http*://*redacted.ch/*
// @include        http*://*apollo.rip/*
// @include        http*://*notwhat.cd/*
// @version        0.1.0
// @date           2017-06-02
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          unsafeWindow
// ==/UserScript==

/*	global document GM_getValue	GM_setValue window unsafeWindow */

/* eslint new-cap: "off" */

(function () {
	'use strict';

	// Get current hostname
	const siteHostname = window.location.host;
	// Get domain-specific settings prefix to make this script multi-site
	const settingsNamePrefix = siteHostname + '_';

	// Defaults
	const position = GM_getValue(settingsNamePrefix + 'position', 'userinfo');
	const grouped = GM_getValue(settingsNamePrefix + 'grouped', '0');

	// Hide torrent search options by default
	if (window.location.href.match(/torrents.php\?freetorrent=1/) && GM_getValue(settingsNamePrefix + 'hide_search') === true) {
		unsafeWindow.toggleTorrentSearch(0);
	}

	if (window.location.href.match('user.php\\?action=edit&userid=')) {
		appendSettings();

		// Location select change handler
		document.getElementById('red_freeleech').onchange = function (e) {
			switch (e.target.value) {
				case 'mainMenu': {
					GM_setValue(settingsNamePrefix + 'position', 'mainMenu');
					const element = document.getElementById('menu').children[1];
					updateLink(element);
					break;
				}
				case 'userinfo': {
					GM_setValue(settingsNamePrefix + 'position', 'userinfo');
					const element = document.getElementById('userinfo_minor');
					updateLink(element);
					break;
				}
				case 'userinfo_major': {
					GM_setValue(settingsNamePrefix + 'position', 'userinfo_major');
					const element = document.getElementById('userinfo_major');
					updateLink(element);
					break;
				}
				default: {
					GM_setValue(settingsNamePrefix + 'position', 'mainMenu');
					const element = document.getElementById('menu').children[1];
					updateLink(element);
				}
			}
		};

		// Grouped checkbox click handler
		document.getElementById('red_freeleech_grouped').onclick = function (e) {
			const checkbox = e.target;
			let element;

			switch (GM_getValue(settingsNamePrefix + 'position')) {
				case 'mainMenu': {
					element = document.getElementById('menu').children[1];
					break;
				}
				case 'userinfo': {
					element = document.getElementById('userinfo_minor');
					break;
				}
				case 'userinfo_major': {
					element = document.getElementById('userinfo_major');
					break;
				}
				default: {
					element = document.getElementById('menu').children[1];
				}
			}
			if (checkbox.checked) {
				GM_setValue(settingsNamePrefix + 'grouped', 1);
				updateLink(element);
			} else {
				GM_setValue(settingsNamePrefix + 'grouped', 0);
				updateLink(element);
			}
		};

		// Hide search checkbox click handler
		document.getElementById('red_freeleech_hide_search').onclick = function (e) {
			const checkbox = e.target;
			if (checkbox.checked) {
				GM_setValue(settingsNamePrefix + 'hide_search', true);
			} else {
				GM_setValue(settingsNamePrefix + 'hide_search', false);
			}
		};
	}

	switch (position) {
		case 'mainMenu': {
			const menu = document.getElementById('menu').children[1];
			appendLink(menu);
			break;
		}
		case 'userinfo': {
			const menu = document.getElementById('userinfo_minor');
			appendLink(menu);
			break;
		}
		case 'userinfo_major': {
			const menu = document.getElementById('userinfo_major');
			appendLink(menu);
			break;
		}
		default: {
			const menu = document.getElementById('userinfo_minor');
			appendLink(menu);
		}
	}

	function appendLink(menu) {
		const freeleechA = createLink('Freeleech', 'torrents.php?freetorrent=1&group_results=' + grouped + '&action=advanced&searchsubmit=1');
		const freeleechLi = createLi('freeleech', freeleechA);
		menu.appendChild(freeleechLi);
	}

	function createLi(x, y) {
		const li = document.createElement('li');
		li.id = 'nav_' + x;
		li.appendChild(y);
		return li;
	}

	function createLink(x, y) {
		const a = document.createElement('a');

		a.innerHTML = x;
		a.href = y;
		return a;
	}

	function removeLi() {
		const element = document.getElementById('nav_freeleech');
		element.parentNode.removeChild(element);
	}

	function updateLink(element) {
		removeLi();
		const freeleechA = createLink('Freeleech', 'torrents.php?freetorrent=1&group_results=' + GM_getValue(settingsNamePrefix + 'grouped', '0') + '&action=advanced&searchsubmit=1');
		const freeleechLi = createLi('freeleech', freeleechA);
		element.appendChild(freeleechLi);
	}

	function appendSettings() {
		// Settings table
		const container = document.getElementsByClassName('main_column')[0];
		const lastTable = container.lastElementChild;
		let settingsHTML = '<a name="freeleech_browser_settings"></a>\n<table cellpadding="6" cellspacing="1" border="0" width="100%" class="layout border user_options" id="freeleech_browser_settings">\n';
		settingsHTML += '<tbody>\n<tr class="colhead_dark"><td colspan="2"><strong>Freeleech Browser Settings (autosaved)</strong></td></tr>\n';
		settingsHTML += '<tr id="red_freeleech_tr"><td class="label tooltip"><strong>Link location</strong></td><td><select name="red_freeleech" id="red_freeleech" data-cip-id="cIPJQ342845641"><option value="mainMenu">Main Menu</option><option value="userinfo">User Info</option><option value="userinfo_major">User Info Major</option></select></td></tr>';
		settingsHTML += '<tr id="red_freeleech_grouped_tr"><td class="label tooltip"><strong>Grouped</strong></td><td><input type="checkbox" name="red_freeleech_grouped" id="red_freeleech_grouped"></td></tr>';
		settingsHTML += '<tr id="red_freeleech_hide_search_tr"><td class="label tooltip"><strong>Hide search</strong></td><td><input type="checkbox" name="red_freeleech_hide_search" id="red_freeleech_hide_search"></td></tr>';
		lastTable.insertAdjacentHTML('afterend', settingsHTML);

		// Link to settings in right menu
		const sectionsElem = document.querySelectorAll('#settings_sections > ul')[0];
		const sectionsHTML = '<h2><a href="#freeleech_browser_settings" class="tooltip" title="Freeleech Browser Settings">Freeleech Browser</a></h2>';
		const li = document.createElement('li');
		li.innerHTML = sectionsHTML;
		sectionsElem.insertBefore(li, document.querySelectorAll('#settings_sections > ul > li:nth-child(10)')[0]);

		// Set location select to current saved value
		const select = document.getElementById('red_freeleech');
		for (let i = 0; i < select.options.length; i++) {
			if (select.options[i].value === position) {
				select.options[i].selected = 'selected';
			}
		}

		// Set grouped checkbox to current saved value
		const groupedCheckbox = document.getElementById('red_freeleech_grouped');
		let checked = GM_getValue(settingsNamePrefix + 'grouped');
		if (checked === 1) {
			groupedCheckbox.checked = 'checked';
		}

		// Set hide search checkbox to current saved value
		const hideSearchCheckbox = document.getElementById('red_freeleech_hide_search');
		checked = GM_getValue(settingsNamePrefix + 'hide_search');
		if (checked === true) {
			hideSearchCheckbox.checked = 'checked';
		}
	}
})();
