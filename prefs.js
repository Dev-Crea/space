/* jshint esversion: 6 */

const GLib = imports.gi.GLib;
const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;
const GObject = imports.gi.GObject;
const Lang = imports.lang;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();
const Convenience = Me.imports.convenience;

const SpaceSettings = new GObject.Class({
  Name: 'Space-Settings',
  Extends: Gtk.Notebook,

  _init: function(params) {
    this.settings = Convenience.getSettings();
  }
});

function init() {
}

function buildPrefsWidget() {
    let widget = new SpaceSettings();
    widget.show_all();

    return widget;
}
