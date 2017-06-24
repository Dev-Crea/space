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

function buildPrefsWidget() {
  let widget = new Gtk.Box({orientation: Gtk.Orientation.VERTICAL});
  let notebook = new Gtk.Notebook();
  notebook.set_scrollable(true);

  return widget;
}
