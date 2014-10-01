'use strict';

// Configuring the Articles module
angular.module('data').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Data', 'data', 'dropdown', '/data(/create)?');
		Menus.addSubMenuItem('topbar', 'data', 'List Data', 'data');
		Menus.addSubMenuItem('topbar', 'data', 'New Datum', 'data/create');
	}
]);