/* jshint esversion: 6 */
/* jshint proto: true */

/*
 * Space Disk Utility
 */

const Clutter = imports.gi.Clutter;
const Lang = imports.lang;

const St = imports.gi.St;
const GObject = imports.gi.GObject;
const GLib = imports.gi.GLib;
const Gtk = imports.gi.Gtk;
const Gio = imports.gi.Gio;
const not = imports.gi.Notify;
const GTop = imports.gi.GTop;

const Main = imports.ui.main;
const Panel = imports.ui.panel;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const MessageTray = imports.ui.messageTray;

const Util = imports.misc.util;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Utils = Me.imports.utils;

const Gettext = imports.gettext.domain('space');
const _ = Gettext.gettext;

/*
 * Initialize application
 */
function init() {
  Utils.initTranslations("space");
}

/*
 * List disk
 */
function ListDisks() {
  this._init.apply(this, arguments);
}

ListDisks.prototype = {
  __proto__: PopupMenu.PopupBaseMenuItem.prototype,

  _init: function(volume_name, volume_size, volume_free, params) {
    PopupMenu.PopupBaseMenuItem.prototype._init.call(this, params);

    this.liste = new St.BoxLayout({ vertical: false });
    this.text_items = this.create_text_items(volume_name, volume_size, volume_free);

    for(let item in this.text_items) {
      this.liste.add_actor(this.text_items[item]);
    }
    this.actor.add_actor(this.liste);
  },
  create_text_items: function(disk_name, disk_free, disk_size) {
    return [
      new St.Label({ text: disk_name, style_class: 'disk-name' }),
      new St.Label({ text: disk_free, style_class: 'disk-free' }),
      new St.Label({ text: disk_size, style_class: 'disk-size' }),
    ];
    /*
    return [new St.Icon({ icon_name: 'drive-multi-disk-symbolic' }),
            new St.Label({ text: disk_name, style_class: 'info-disk-name info-disk' }),
            new St.Label({ text: '|', style_class: 'separator info-disk' }),
            new St.Label({ text: disk_size, style_class: 'info-disk-size info-disk' }),
            new St.Label({ text: '|', style_class: 'separator info-disk' }),
            new St.Label({ text: disk_free, style_class: 'info-disk-free info-disk' })];
            */
  },
};

/*
 * Application window
 */
const SpaceIndicator = new Lang.Class({
  Name: 'SpaceIndicator',
  Extends: PanelMenu.Button,

  _TimeoutUd: null,
  _FirstTimeoutId: null,
  _updateProcess_sourceId: null,
  _updateProcess_stream: null,

  _init: function() {
    this.parent(0.0, "SpaceIndicator");
    Gtk.IconTheme.get_default().append_search_path(Me.dir.get_child('icons').get_path());

    this.updateIcon = new St.Icon({icon_name: "hard-disk", style_class: 'system-status-icon'});

    let box = new St.BoxLayout({ vertical: false, style_class: 'panel-status-menu-box' });
    this.label = new St.Label({ text: '', y_expand: true, y_align: Clutter.ActorAlign.CENTER });

    box.add_child(this.updateIcon);
    box.add_child(this.label);
    this.actor.add_child(box);

    // Prepare menu
    this.menuExpander = new PopupMenu.PopupSubMenuMenuItem('');
    this.updatesListMenuLabel = new St.Label();
    this.menuExpander.menu.box.add(this.updatesListMenuLabel);
    this.menuExpander.menu.box.style_class = 'space-list';

    // Configure settings popup
    let settingsMenuItem = new PopupMenu.PopupMenuItem(_('Settings'));

    //Add menu elements
    // this.menu.addMenuItem(this.menuExpander);
    this.menu.addMenuItem(settingsMenuItem);

    // Apply action to menu
    settingsMenuItem.connect('activate', Lang.bind(this, this._openSettings));

    // Add list disk
    this._setupDiskViews();
  },

  _setupDiskViews: function() {
    let arrayMount = [];
    arrayMount.push("/");
    arrayMount.push("/home/jeremy/.wine");
    arrayMount.push("/home/jeremy/Games");

    for(let i = 0; i < arrayMount.length; i++) {
      this._createDefaultApps(arrayMount[i], i, arrayMount);
    }
  },

  _createDefaultApps: function(element, index, array) {
    let d = new Disk(element);
    let name = d._get_mount();
    let free = d._get_size_disk_free() + ' / ';
    let size = d._get_size_disk() + ' Go';
    let info = new ListDisks(name, free, size, {});
    this.menu.addMenuItem(info, 0);
  },

  _openSettings: function () {
    Util.spawn([ "gnome-shell-extension-prefs", Me.uuid ]);
  },

  destroy: function() {
  },
});

/*
 * System disk information
 */
const Disk = new Lang.Class({
  Name: 'SystemMonitor.Disk',

  _init: function(path) {
    this.path = path;
    this.gtop = new GTop.glibtop_fsusage();
    GTop.glibtop_get_fsusage(this.gtop, this.path);

    // Size disk
    size = (this.gtop.blocks - this.gtop.bfree) / this.gtop.blocks;
    // this.size = size;//(size * 1073741824) / this.gtop.blocks;
    this.size = this.gtop.blocks;//(size * 1073741824) / this.gtop.blocks;
    this.size_unit = 'Go';

    // Free space to disk with units
    this.free = 100 - Math.round(size * 100);
    this.free_unit = '%';

    this.flag = this.gtop.flags;
    this.block = this.gtop.blocks;
    this.bfree = this.gtop.bfree;
    this.bavail = this.gtop.bavail;
    this.file = this.gtop.files;
    this.ffree = this.gtop.ffree;
  },

  _get_size: function() {
    return this.size;//.toFixed(2) + " " + this.size_unit;
  },

  _get_free: function() {
    return this.free + " " + this.free_unit;
  },

  _get_mount: function() {
    return this.path;
  },

  /* Return disk size */
  _get_size_disk: function() {
    let calcul = Math.floor((this.block * 3.814697265625) / 1000000);
    return '' + calcul;
  },

  /* Return disk size free */
  _get_size_disk_free: function() {
    let calcul = Math.floor((this.bavail * 3.814697265625) / 1000000);
    return '' + calcul;
  }
});

/*
 * Enable/Disable extension
 */
let spacediskindicator;

function enable() {
  spacediskindicator = new SpaceIndicator();
  let menu = Main.panel;
  menu.addToStatusArea("SpaceIndicator", spacediskindicator);
}

function disable() {
  spacediskindicator.destroy();
}
