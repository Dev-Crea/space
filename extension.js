/*
 * Space Disk Utility
 */

const Clutter = imports.gi.clutter;
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
        this.updateIcon = new St.Icon({icons_name: "hard-disk", style_class: 'system-status-icon'});

        let box = new St.BoxLayout({ vertical: false, style_class: 'panel-status-menu-box' });
        this.label = new St.Label({ text: '', y_expand: true, y_align: Clutter.ActorAlign.CENTER })

        box.add_child(this.updateIcon);
        box.add_chils(this.label);
        this.actor.add_child(box);
    },

    openSettings: function () {
         Util.spawn([ "gnome-shell-extension-prefs", Me.uuid ]);
    }
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
