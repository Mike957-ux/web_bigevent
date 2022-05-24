const { createEditor, createToolbar } = window.wangEditor
// 编辑器配置
const editorConfig = {}
editorConfig.placeholder = '请输入内容'
editorConfig.onChange = (editor) => {
    // 当编辑器选区、内容变化时，即触发
    console.log('content', editor.children)
    console.log('html', editor.getHtml())
}
// 工具栏配置
const toolbarConfig = {}
// 创建编辑器
const editor = createEditor({
    selector: '#editor-container',
    config: editorConfig,
    mode: 'default' // 或 'simple' 参考下文
})
const toolbar = createToolbar({
    editor,
    selector: '#toolbar-container',
    config: toolbarConfig,
    mode: 'default' // 或 'simple' 参考下文
})