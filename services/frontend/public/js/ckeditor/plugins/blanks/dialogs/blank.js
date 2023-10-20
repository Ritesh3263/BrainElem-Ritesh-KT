CKEDITOR.dialog.add( 'blankDialog', function( editor ) {
    return {
        title: 'New blank',
        minWidth: 400,
        minHeight: 200,
        contents: [
            {
                id: 'tab-basic',
                label: 'Basic Settings',
                elements: [
                    {
                        type: 'text',
                        id: 'blank',
                        label: 'Blank',
                        validate: CKEDITOR.dialog.validate.notEmpty( "Blank field cannot be empty." ),

                        setup: function( element ) {
                            this.setValue( element.getText() );
                        },

                        commit: function( element ) {
                            element.setText( this.getValue() );
                            element.setAttribute('data-correct-answer', btoa(this.getValue()))
                                                        
                            element.setAttribute('contenteditable', 'false')
                            element.setAttribute('id', Date.now())
                            element.setStyles({'border': '1px solid black', 'border-radius': '5px', 'display': 'inline-block', 'cursor': 'pointer', 'caret-color': 'transparent', 'font-size':'12px', 'padding': '0px 6px', 'margin': '0px 3px'})

                        }
                    },
                    {
                        type: 'text',
                        default: '1',
                        id: 'points',
                        label: 'Points for correct answer',
                        validate: CKEDITOR.dialog.validate.integer( "Points field must be number." ),

                        setup: function( element ) {
                            this.setValue( element.getAttribute( "value" ));
                        },

                        commit: function( element ) {
                            element.setAttribute( "value", this.getValue() );
                            element.setAttribute( "title", "Points: "+this.getValue() );
                        }

                    }
                ]
            }
        ],

        onShow: function() {
            var selection = editor.getSelection();
            var element = selection.getStartElement();

            if ( element )
                element = element.getAscendant( 'blank', true );

            if ( !element || element.getName() != 'blank' ) {
                element = editor.document.createElement( 'blank' );
                this.insertMode = true;
            }
            else
                this.insertMode = false;

            this.element = element;
            if ( !this.insertMode )
                this.setupContent( this.element );
        },

        onOk: function() {

            var dialog = this;
            var blank = this.element;
            this.commitContent( blank );
            if ( this.insertMode )
                editor.insertElement( blank );
        }
    };
});