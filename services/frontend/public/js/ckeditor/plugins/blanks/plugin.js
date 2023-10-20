CKEDITOR.plugins.add( 'blanks', {
    icons: 'blanks',
    init: function( editor ) {

        editor.addCommand( 'insertBlank', new CKEDITOR.dialogCommand( 'blankDialog' ) );
            
        editor.ui.addButton( 'Blanks', {
            label: 'Add new blank',
            command: 'insertBlank',
            toolbar: 'insert'
        });


        editor.on('doubleclick', function(event) {
            if (event.data.element.is('blank')){
                $(".modal-content .blanks .cke_button__blanks").trigger('click');
            }
        });
        

        CKEDITOR.dialog.add( 'blankDialog', this.path + 'dialogs/blank.js' )
    }
});
