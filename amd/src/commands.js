// This file is part of Moodle - https://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <https://www.gnu.org/licenses/>.

/**
 * Commands helper for the Moodle tiny_fontfamily plugin.
 *
 * @module      plugintype_pluginname/commands
 * @copyright   2023 Mikko Haiku <mikko.haiku@mediamaisteri.com>
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

import {getButtonImage} from 'editor_tiny/utils';
import {get_string as getString} from 'core/str';
import {
    component,
    fontfamilyButtonName,
    fontfamilyMenuItemName,
    icon,
} from './common';

/**
 * Handle the action for your plugin.
 * @param {TinyMCE.editor} editor The tinyMCE editor instance.
 * @param {integer} fontfamily Font family in integer.
 */
const handleAction = (editor, fontfamily) => {
    editor.selection.dom.setAttrib(editor.selection.getNode(), "style", "font-family: " + fontfamily);
};

/**
 * Get the setup function for the buttons.
 *
 * This is performed in an async function which ultimately returns the registration function as the
 * Tiny.AddOnManager.Add() function does not support async functions.
 *
 * @returns {function} The registration function to call within the Plugin.add function.
 */
export const getSetup = async() => {
    const [
        fontfamilyButtonNameTitle,
        fontfamilyMenuItemNameTitle,
        buttonImage,
    ] = await Promise.all([
        getString('button_fontfamily', component),
        getString('menuitem_fontfamily', component),
        getButtonImage('icon', component),
    ]);

    return (editor) => {
        // Register the Moodle SVG as an icon suitable for use as a TinyMCE toolbar button.
        editor.ui.registry.addIcon(icon, buttonImage.html);

        // Register the fontfamily Toolbar Button.
        editor.ui.registry.addButton(fontfamilyButtonName, {
            icon,
            tooltip: fontfamilyButtonNameTitle,
            onAction: () => handleAction(editor),
        });

        // Add the fontfamily Menu Item.
        // This allows it to be added to a standard menu, or a context menu.
        editor.ui.registry.addMenuItem(fontfamilyMenuItemName, {
            icon,
            text: fontfamilyMenuItemNameTitle,
            onAction: () => handleAction(editor),
        });

        // Define the font familys and their corresponding text labels
        const fontfamilys = [
            { family: "Arial", label: "Arial" },
            { family: "Verdana", label: "Verdana" },
            { family: "Tahoma", label: "Tahoma" },
            { family: "Trebuchet MS", label: "Trebuchet MS" },
            { family: "Times New Roman", label: "Times New Roman" },
            { family: "Georgia", label: "Georgia" },
            { family: "Garamond", label: "Garamond" },
            { family: "Courier New", label: "Courier New" },
            { family: "Brush Script MT", label: "Brush Script MT" },
        ];

        /**
         * Handle the font family menu item action.
         *
         * @param {Editor} editor - The editor instance.
         * @param {number} family - The font family to set.
         * @returns {Function} - The action handler function.
         */
        function handlefontfamily(editor, family) {
            return () => handleAction(editor, family);
        }

        // Create an array of submenu items using a map function
        const submenuItems = fontfamilys.map(({family, label}) => ({
            type: 'menuitem',
            text: label,
            onAction: handlefontfamily(editor, family),
        }));

        // Add the nested menu item to the editor UI
        editor.ui.registry.addNestedMenuItem(fontfamilyMenuItemName, {
            icon,
            text: fontfamilyMenuItemNameTitle,
            getSubmenuItems: () => submenuItems,
        });

    };
};
