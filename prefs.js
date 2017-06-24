/* jshint esversion: 6 */

const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const GObject = imports.gi.GObject;
const Lang = imports.lang;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

const SETTINGS_SCHEMA = "org.gnome.shell.extensions.space";
const NAME_APPLICATION = "Space";

/*
 * Initialize application
 */
function init() {
  Convenience.initTranslations(NAME_APPLICATION);
  gsettings = Convenience.getSettings(SETTINGS_SCHEMA);
  settings = {
    disk_percent: {
      type: "b",
      label: 'Percent ?'
    },
    list_disk: {
      type: "b",
      label: "Disk to survey"
    }
  };
}

const SpaceSettings = new GObject.Class({
  Name: 'Space-Settings',
  Extends: Gtk.Grid,
  GTypeName: 'SettingsPrefsWidget',

  _init: function(params) {
    this.parent(params);
    this.margin = 12;
    this.row_spacing = this.column_spacing = 6;
    this.set_orientation(Gtk.Orientation.VERTICAL);
    this._settings = Convenience.getSettings();
  }
});

function buildPrefsWidget() {
  let widget = new SpaceSettings();
  widget.show_all();

  return widget;
}
