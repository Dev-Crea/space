
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const Gtk = imports.gi.Gtk;

const St = imports.gi.St;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;
const Shell = imports.gi.Shell;
const Atk = imports.gi.Atk;

const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const Lang = imports.lang;
const FileUtils = imports.misc.fileUtils;
const Util = imports.misc.util;

const IndicatorName = 'Space';

/*
 * Popup Menu
 */
function PopupGiconMenuItem() {
	this._init.apply(this, arguments);
}

PopupGiconMenuItem.prototype = {
	__proto__: PopupMenu.PopupBaseMenuItem.prototype,

	_init: function(volume_name, gIcon, params) {
		PopupMenu.PopupBaseMenuItem.prototype._init.call(this, params);

		this.label = new St.Label({ text: volume_name });
		this._icon = new St.Icon({
			gicon: gIcon,
			style_class: 'popup-menu-icon' });
		this.actor.add_child(this._icon, {align: St.Align.END });
		this.actor.add_child(this.label);
	},
};

/*
 * Space Object
 */
const Space = new Lang.Class({
	Name: IndicatorName,
	Extends: PanelMenu.Button,

	_init: function(metadata, params) {
		this.parent(null, IndicatorName);
		this.actor.accessible_role = Atk.Role.TOGGLE_BUTTON;

		// drive-multidisk-symbolic
		// drive-harddisk-symbolic
		this._icon = new St.Icon({ 	icon_name: 'drive-harddisk-symbolic',
									style_class: 'system-status-icon' });
		this.actor.add_actor(this._icon);
		this.actor.add_style_class_name('panel-status-button');

		this.connect('destroy', Lang.bind(this, this._onDestroy));

		this._setupDiskViews();
	},

	_onDestroy: function() {
		this._monitor.cancel();
		Mainloop.source_remove();
	},

	_setupDiskViews: function() {
	}
});

function init() {
	global.logError('Init le module');
}

/*
 * Enable/Disable extension
 */
let _indicator;

function enable() {
	global.logError('Active le module');
    _indicator = new Space();
    Main.panel.addToStatusArea(IndicatorName, _indicator);
}

function disable() {
	global.logError('Desactive le module');
    _indicator.destroy();
    _indicator = null;
}
