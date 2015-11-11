
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
const not = imports.gi.Notify;
const GTop = imports.gi.GTop;

const IndicatorName = 'Space';

/*
 * Popup Menu
 */
function PopupGiconMenuItem() {
	this._init.apply(this, arguments);
}

PopupGiconMenuItem.prototype = {
	__proto__: PopupMenu.PopupBaseMenuItem.prototype,

	_init: function(volume_name, params) {
		PopupMenu.PopupBaseMenuItem.prototype._init.call(this, params);

		this.label = new St.Label({ text: volume_name });
		this._icon = new St.Icon({
			icon_name: 'drive-multidisk-symbolic',
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
		//not.notify_notification_set_app_name(notification, IndicatorName);
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
		let menu = this._createDefaultApps();
		this.menu.addMenuItem(menu, 0);
	},

	_createDefaultApps: function() {
		let d = new Disk();
		let text = 'Volume de ' + d._get_size() + ' - ' + d._get_used() + ' de libre.';

		let vol = new PopupGiconMenuItem(text, {});
		return vol;
	},
});

/*
 * System Disk
 */
const Disk = new Lang.Class({
	Name: 'SystemMonitor.Disk',

	_init: function() {
		this.gtop = new GTop.glibtop_fsusage();
		this.usage = 10;
		this.path= "/";
	},

	_get_size: function() {
		return "60 Go".toString();
	},

	_get_used: function() {
		return "15 %".toString();
	},
});

function init() {
}

/*
 * Enable/Disable extension
 */
let _indicator;

function enable() {
    _indicator = new Space();
    Main.panel.addToStatusArea(IndicatorName, _indicator);
}

function disable() {
	MountsMonitor.disconnect();
    _indicator.destroy();
    _indicator = null;
}
