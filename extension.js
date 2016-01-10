/*
 * Space Disk Utility
 */

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
const Slider = imports.ui.slider;

const Lang = imports.lang;
const IndicatorName = 'Space';
let Style;

/*
 * Popup Menu
 */
function PopupGiconMenuItem() {
	this._init.apply(this, arguments);
}

PopupGiconMenuItem.prototype = {
	__proto__: PopupMenu.PopupBaseMenuItem.prototype,

	_init: function(volume_name, volume_size, volume_free, params) {
		PopupMenu.PopupBaseMenuItem.prototype._init.call(this, params);

        this.liste = new St.BoxLayout({ vertical: false });
        this.text_items = this.create_text_items(volume_name, volume_size, volume_free);

        for(let item in  this.text_items) {
            this.liste.add_actor(this.text_items[item]);
        }
        this.actor.add_actor(this.liste);
    },
    create_text_items: function(disk_name, disk_size, disk_free) {
        return [new St.Icon({ icon_name: 'drive-multidisk-symbolic' }),
                new St.Label({ text: disk_name, style_class: 'info-disk-name info-disk' }),
                new St.Label({ text: "|", style_class: 'separator info-disk' }),
                new St.Label({ text: disk_size, style_class: 'info-disk-size info-disk' }),
                new St.Label({ text: "|", style_class: 'separator info-disk' }),
                new St.Label({ text: disk_free , style_class: 'info-disk-free info-disk' })];
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
        let name = d._get_mount();
        let size = ' Taille : ' + d._get_size();
        let free = ' Libre : ' + d._get_free();
        let vol = new PopupGiconMenuItem(name, size, free, {});
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
        return 'Volume "' + this.path+'" ';
    }
});

function init() {
}

/*
 * Enable/Disable extension
 */
let spacediskindicator;

function enable() {
    spacediskindicator = new Space();
    Main.panel.addToStatusArea(IndicatorName, spacediskindicator);
}

function disable() {
	MountsMonitor.disconnect();
    spacediskindicator.destroy();
    spacediskindicator = null;
}
