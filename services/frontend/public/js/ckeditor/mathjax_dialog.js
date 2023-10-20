/*
 Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
*/
CKEDITOR.dialog.add("mathjax", function(d) {
    var c, b = d.lang.mathjax;
    let keybordId = Date.now();
    return {
        title: b.title,
        minWidth: 350,
        minHeight: 100,
        contents: [{
            id: "info",
            elements: [{
                id: "equation",
                type: "textarea",
                style: "display:none",
                label: b.dialogInput,
                onLoad: function() {
                    var a = this;
                    if (!CKEDITOR.env.ie || 8 != CKEDITOR.env.version) this.getInputElement().on("keyup", function() {
                        c.setValue("\\(" + a.getInputElement().getValue() + "\\)")
                    })
                },
                setup: function(a) {
                    orginal_field = this;
                    this.setValue(CKEDITOR.plugins.mathjax.trim(a.data.math))
                },
                commit: function(a) {
                    a.setData("math", "\\(" + this.getValue() +
                        "\\)")
                }
            }, 
            {
                id: "mathlive",
                type: "html",
                html: "<div style='width:90%;'><math-field style='font-size: 22px;' id='"+keybordId+"' virtual-keyboard-mode='onfocus' >f(x)=</math-field></div>",
                label: b.dialogInput,
                onLoad: function() {


                    },
                setup: function(a) {
                    let el = document.getElementById(keybordId)
                    el.setValue(orginal_field.getInputElement().getValue())
                    el.addEventListener('input',(ev) => {
                        orginal_field.setValue(ev.target.value)
                    });
                    setTimeout(function(){ el.focus(); }, 300);
                    

                },
                commit: function(a) {
                    console.log('COMMITING MATHLIVE CKEDITOR MODAL WINDOW')
                },
                onHide: function(a) {
                    console.log('HIDONG MATHLIVE CKEDITOR MODAL WINDOW')
                }
            },
            
            {
                id: "documentation",
                type: "html",
                html: '\x3cdiv style\x3d";display:none;width:100%;text-align:right;margin:-8px 0 10px"\x3e\x3ca class\x3d"cke_mathjax_doc" href\x3d"' + b.docUrl + '" target\x3d"_black" style\x3d"cursor:pointer;color:#00B2CE;text-decoration:underline"\x3e' + b.docLabel + "\x3c/a\x3e\x3c/div\x3e"
            }, !(CKEDITOR.env.ie && 8 == CKEDITOR.env.version) && {
                id: "preview",
                type: "html",
                html: '\x3cdiv style\x3d";display:none;width:100%;text-align:center;"\x3e\x3ciframe style\x3d"border:0;width:0;height:0;font-size:20px" scrolling\x3d"no" frameborder\x3d"0" allowTransparency\x3d"true" src\x3d"' +
                    CKEDITOR.plugins.mathjax.fixSrc + '"\x3e\x3c/iframe\x3e\x3c/div\x3e',
                onLoad: function() {
                    var a = CKEDITOR.document.getById(this.domId).getChild(0);
                    c = new CKEDITOR.plugins.mathjax.frameWrapper(a, d)
                },
                setup: function(a) {
                    c.setValue(a.data.math)
                }
            }]
        }]
    }
});