// Libraries
import moment from "moment";

export const exportJSON = async (name, json) => {
    const now = moment().format('YYYY_MM_DD_HH_mm')
    const filename = `${String(name).replace(" ", "_")}_${now}`

    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(json));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", filename + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}