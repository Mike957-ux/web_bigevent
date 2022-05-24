function initEditor() {
    tinymce.init({
        //选择class为content的标签作为编辑器
        selector: 'textarea',
        plugins: 'advlist autolink link image lists preview',
        language_url: '/assets/lib/tinymce/zh_CN.js',
        language: 'zh_CN',
        width: '100%',
        height: 300,
        // inline: true,
        menubar: false,
    })
}
