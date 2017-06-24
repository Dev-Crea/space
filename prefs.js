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

const SpaceSettings = new GObject.Class({
  Name: 'Space-Settings',
  Extends: Gtk.Notebook,

  _init: function(params) {
    /*
    Convenience.initTranslations(NAME_APPLICATION);
    gsettings = Convenience.getSettings(SETTINGS_SCHEMA);
    settings = {
      disk_percent: {
        type: "b",
        label: 'Percent ?'
      },
      list_disk: {
        type: "a",
        label: "Disk to survey"
      }
    };

    let disk_page = new Gtk.Grid();
    let array_disks = new Gtk.Label({ label: 'Disk :', use_markup: true, halign: Gtk.Align.START });
    this.append_page(disk_page, new Gtk.Label({label: "Disks" }));

    disk_page.add(array_disks);
    */
  }
});

function init() {
}

function buildPrefsWidget() {
  let widget = new SpaceSettings();

  widget.show_all();

  return widget;
}
