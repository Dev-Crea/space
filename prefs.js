/* jshint esversion: 6 */

const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;
const Gio = imports.gi.Gio;
const Lang = imports.lang;
const Me = imports.misc.extensionUtils.getCurrentExtension();
const Utils = Me.imports.utils;

const Gettext = imports.gettext.domain('space');
const _ = Gettext.gettext;

let settings;

function init() {
    settings = Utils.getSettings(Me);
}

function buildPrefsWidget() {
    // Prepare labels and controls settings windows
    let buildable = new Gtk.Builder();
    buildable.add_from_file( Me.dir.get_path() + '/prefs.xml' );
    let box = buildable.get_object('vbox_built');

    // Bind fields to settings
    settings.bind('disk-percent', buildable.get_object('field_diskpercent'), 'active', Gio.SettingsBindFlags.DEFAULT);

    // Display box
    box.show_all();
    return box;
}
