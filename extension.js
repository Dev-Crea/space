
const Gio = imports.gi.Gio;
const GLib = imports.gi.GLib;
const Gtk = imports.gi.Gtk;
const not = imports.gi.Notify;
const GTop = imports.gi.GTop;

const St = imports.gi.St;
const Main = imports.ui.main;
const Mainloop = imports.mainloop;
const Shell = imports.gi.Shell;
const Atk = imports.gi.Atk;

const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;

const Lang = imports.lang;

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
        let elements = new Array(["icons", "name", "size"]);

        this.liste = new St.BoxLayout({ vertical: true });
        this.text_items = this.create_text_items(volume_name);
        for(let item in  this.text_items) {
            this.liste.add_actor(this.text_items[item]);
        }
        this.actor.add_actor(this.liste);
    },
    create_text_items: function(label) {
        return [new St.Icon({ icon_name: 'drive-multidisk-symbolic' }),
                new St.Label({ text: label })];
	},
};

/*
 * Space Object
 * Princpal object - Button for listing disks
 */
const Space = new Lang.Class({
	Name: IndicatorName,
	Extends: PanelMenu.Button,

	_init: function(metadata, params) {
		//not.notify_notification_set_app_name(notification, IndicatorName);
		this.parent(null, IndicatorName);
		this.actor.accessible_role = Atk.Role.TOGGLE_BUTTON;

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
        let arrayMount = new Array();
        arrayMount.push("/tmp");
        arrayMount.push("/");

        for(let i = 0; i < arrayMount.length; i++) {
            this._createDefaultApps(arrayMount[i], i, arrayMount);
        }
	},

	_createDefaultApps: function(element, index, array) {
        let d = new Disk(element);
        let text = d._get_mount() + ' Taille : ' + d._get_size() + ' - ' + d._get_free() + ' de libre';
        let vol = new PopupGiconMenuItem(text, {});
        this.menu.addMenuItem(vol, 0);
	},
});

/*
 * System Disk
 */
const Disk = new Lang.Class({
	Name: 'SystemMonitor.Disk',

	_init: function(path) {

		this.path= path;
		this.gtop = new GTop.glibtop_fsusage();
		GTop.glibtop_get_fsusage(this.gtop, this.path);

		// Size disk with units
        s = (this.gtop.blocks - this.gtop.bfree) / this.gtop.blocks;
		this.size = (s * 1073741824) / this.gtop.blocks;
		this.size_unit = 'Go';

		// Free space to disk with units
		this.free = 100 - Math.round(s * 100)
		this.free_unit = "%";
	},

	_get_size: function() {
		return this.size.toFixed(2) + " " + this.size_unit;
	},

	_get_free: function() {
		return this.free + " " + this.free_unit;
	},

    _get_mount: function() {
        return 'Disk "' + this.path + '" | ';
    }
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
