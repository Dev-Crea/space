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

        this.updateIcon = new St.Icon({icon_name: "hard-disk",
            style_class: 'system-status-icon'});

        let box = new St.BoxLayout({ vertical: false,
            style_class: 'panel-status-menu-box' });
        this.label = new St.Label({ text: '',
            y_expand: true,
            y_align: Clutter.ActorAlign.CENTER });

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
        this.menu.addMenuItem(this.menuExpander);
        this.menu.addMenuItem(settingsMenuItem);

        // Apply action to menu
        settingsMenuItem.connect('activate', Lang.bind(this, this._openSettings));
    },

    _openSettings: function () {
         Util.spawn([ "gnome-shell-extension-prefs", Me.uuid ]);
    },
    destroy: function() {
    },
});

/*
 * Enable/Disable extension
 */
let spacediskindicator;

function enable() {
    spacediskindicator = new SpaceIndicator();
    Main.panel.addToStatusArea("SpaceIndicator", spacediskindicator);
}

function disable() {
    spacediskindicator.destroy();
}
