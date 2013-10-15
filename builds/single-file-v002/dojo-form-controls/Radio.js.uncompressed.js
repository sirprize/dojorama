define("dojo-form-controls/Radio", [
    "dojo/_base/declare",
    "./Checkbox"
], function (
    declare,
    Checkbox
) {
    return declare([Checkbox], {
        // summary:
        //      Provide widget functionality for an HTML <input type="radio"> control
        
        type: "radio"
    });
});