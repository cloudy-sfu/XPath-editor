const dom_parser = new DOMParser();
const xml_parser = new XMLSerializer();
function evaluate_xpath(xpath, xml) {
    const xml_document = dom_parser.parseFromString(xml, "application/xml");
    const parser_error = xml_document.querySelector("parsererror");
    if (parser_error) {
        alert(parser_error.textContent);
        return
    }
    let result_generator;
    try {
        result_generator = document.evaluate(xpath, xml_document, null, XPathResult.ANY_TYPE, null);
    } catch (e) {
        alert("XPath expression is not valid or empty.");
        return
    }
    let results = [];
    let result = result_generator.iterateNext();
    while (result != null) {
        results.push(result);
        result = result_generator.iterateNext();
    }
    return results
}
function evaluate_xquery(xquery, xml) {
    let results = [];
    try {
        SaxonJS.XPath.evaluate(xquery, jQuery.parseXML(xml), {resultForm: 'iterator'})
            .forEachItem(function (node) {results.push(node);})
    }
    catch (e) {alert(e);return}
    return results
}
// Specially designed, force <a></a> instead of <a />.
// function node_to_string(node) {
//     let wrapper = document.createElement('div');
//     wrapper.appendChild(node);
//     return wrapper.innerHTML.replaceAll("\n", "\\n")
// }
function display_query_results(results) {
    xml_out_editor.setValue('');
    if (results.length === 0) {alert('No result.');return}
    for (const result of results) {
        xml_out_editor.replaceRange(
            xml_parser.serializeToString(result).replaceAll("\n", "\\n"),
            CodeMirror.Pos(xml_out_editor.lastLine()));
        xml_out_editor.replaceRange('\n', CodeMirror.Pos(xml_out_editor.lastLine()));
    }
}
function export_query_results() {
    const filename = window.prompt("Filename:", "query_results");
    if (filename) {
        const query_results = xml_out_editor.getValue();
        const blob = new Blob([query_results], {type: 'application/xml'});
        const dl_url = URL.createObjectURL(blob);
        const dl_element = document.createElement('a');
        dl_element.setAttribute('download', filename + ".xml");
        dl_element.setAttribute('href', dl_url);
        dl_element.click();
    }
}
function evaluate_pivot() {
    const xquery = query_editor.getValue();
    const xml_source = tab_selector("xml-switch");
    const lang = tab_selector("query-switch");
    const q_func = {"query-xpath-tab": evaluate_xpath, "query-xquery-tab": evaluate_xquery};
    if (xml_source === "xml-source-textarea-tab") {
        const results = q_func[lang](xquery, xml_in_editor.getValue());
        display_query_results(results);
    } else if (xml_source === "xml-source-file-tab") {
        const reader = new FileReader();
        reader.onload = () => {
            const results = q_func[lang](xquery, reader.result);
            display_query_results(results);
        };
        reader.readAsText(document.getElementById('xml-file').files[0]);
    }
}
