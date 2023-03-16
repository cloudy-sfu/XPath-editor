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
// Specially designed, force <a></a> instead of <a />.
// function node_to_string(node) {
//     let wrapper = document.createElement('div');
//     wrapper.appendChild(node);
//     return wrapper.innerHTML.replaceAll("\n", "\\n")
// }
function display_query_results(results) {
    xml_out_editor.setValue('');
    if (results.length === 0) {
        alert('No result.');
        return
    }
    for (const result of results) {
        xml_out_editor.replaceRange(
            xml_parser.serializeToString(result).replaceAll("\n", "\\n"),
            CodeMirror.Pos(xml_out_editor.lastLine()));
        xml_out_editor.replaceRange('\n', CodeMirror.Pos(xml_out_editor.lastLine()));
    }
}
function evaluate_text_area() {
    const xpath = xpath_editor.getValue();
    const xml = xml_in_editor.getValue();
    const results = evaluate_xpath(xpath, xml);
    display_query_results(results);
}
function evaluate_xml_file() {
    const xpath = xpath_editor.getValue();
    let xml = '';
    const reader = new FileReader();
    reader.onload = () => {
        xml = reader.result;
        const results = evaluate_xpath(xpath, xml);
        display_query_results(results);
    };
    reader.readAsText(document.getElementById('xml-input-file').files[0]);
}