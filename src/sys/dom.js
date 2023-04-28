/** system file for common DOM operations */

/**
 * Bypasses dynamic RAM calculation of loading the document object.
 * @returns {Document} The DOM instance.
 */
export function dom() {
    return eval('document');
} // end function dom

/**
 * Bypasses dynamic RAM calculation of loading the window object.
 * @returns {Window} The window instance.
 */
export function window() {
    return eval('window');
} // end function window