function tab_selector(id) {
    const tabGroup = document.querySelector("#" + id);
    const childNodes = tabGroup.children;
    for (let i = 0; i < childNodes.length; i++) {
        if (childNodes[i].getAttribute("aria-selected") === "true") {
            return childNodes[i].id
        }
    }
}
let query_editor = null;
function generate_cm_editor(cm_mode) {
    let existed_code = '';
    if (query_editor) {
        existed_code = query_editor.getValue();
    }
    document.getElementById("query-editor").innerHTML = '';
    if (cm_mode === "xpath") {
        query_editor = CodeMirror(document.getElementById("query-editor"), {
            mode: "text",
            value: existed_code,
            theme: "default",
            lineNumbers: false,
            lineWrapping: true,
        });
        query_editor.setSize(null, query_editor.defaultTextHeight() * 2.5);
    } else if (cm_mode === "xquery") {
        query_editor = CodeMirror(document.getElementById("query-editor"), {
            mode: "xquery",
            value: existed_code,
            theme: "default",
            lineNumbers: true,
        });
        query_editor.setSize(null, query_editor.defaultTextHeight() * 5.5);
    }
}
generate_cm_editor("xpath");
document.getElementById("query-switch").addEventListener("click", () => {
    const lang = tab_selector("query-switch");
    const cm_mode = {"query-xpath-tab": "xpath", "query-xquery-tab": "xquery"};
    generate_cm_editor(cm_mode[lang]);
})
