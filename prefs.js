/* jshint esversion: 6 */

const GLib = imports.gi.GLib;
const GObject = imports.gi.GObject;
const Gtk = imports.gi.Gtk;
const Gio = imports.gi.Gio;
const Lang = imports.lang;

const Gettext = imports.gettext.domain('gnome-shell-extensions');
const _ = Gettext.gettext;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

function init() {
  Convenience.initTranslations();
}

const SettingsPrefsWidget = new GObject.class({
  Name: 'Settings.Prefs.Widget',
  GTypeName: 'SettingsPrefsWidget',
  Extends: Gtk.Grid,

  _init: function(params) {
    this.parent(params);
    this.margin = 12;
    this.row_spacing = this.column_spacing = 6;
    this.set_orientation(Gtk.Orientation.VERTICAL);
    this._settings = Convenience.getSettings();
  }
});

function buildPrefsWidget() {
  let widget = new SettingsPrefsWidget();
  widget.show_all();

  return widget;
}
