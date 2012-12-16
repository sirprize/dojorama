define("dojo-form-controls/Textarea", [
    "dojo/_base/declare",
    "./Textbox"
], function (
    declare,
    Textbox
) {
    return declare([Textbox], {
        
        rows: "3",
        cols: "20",
        templateString: "<textarea ${!nameAttr}></textarea>",

        postMixInProperties: function(){
            // Copy value from srcNodeRef, unless user specified a value explicitly (or there is no srcNodeRef)
            // TODO: parser will handle this in 2.0
            if(!this.value && this.srcNodeRef){
                this.value = this.srcNodeRef.value;
            }
            this.inherited(arguments);
        }
    });
});