// Libraries
import axios from "axios";

class TwinbaseManager {
    static fetchMetadataOfDT = async (uri) => {
        const resp = await axios.get(`${uri}/index.json`);
        return resp.data;
    }

    static fetchMetadataByID = async (payload) => {
        const resp = await axios.post(`${process.env.REACT_APP_PYTHON_URL}/twinbase/getDTByID`, payload);
        return resp.data;
    }
}

export default TwinbaseManager;