'use strict';

// Configuring the Articles module
angular.module('charts').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Charts', 'charts', 'dropdown', '/charts(/create)?');
		Menus.addSubMenuItem('topbar', 'charts', 'List Charts', 'charts');
		Menus.addSubMenuItem('topbar', 'charts', 'New Chart', 'charts/create');
	}
]);