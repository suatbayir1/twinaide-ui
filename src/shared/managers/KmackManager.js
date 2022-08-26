// Libraries
import axios from "axios";
import { NotificationManager } from 'react-notifications';

class KmackManager {
    token = "";

    static fetchMetadataOfDT = async (uri) => {
        const resp = await axios.get(`${uri}/index.json`);
        return resp.data;
    }

    fetchThingByID = async (thingID) => {
        console.log(this.token);
        console.log(thingID);
        const resp = await axios.get(
            `${process.env.REACT_APP_KMACK_URL}/kmac/${thingID}`,
            { headers: { "Authorization": `Bearer ${this.token}` } }
        );
        console.log(resp.data);
        return resp.data;
    }

    login = async (username) => {
        try {
            const resp = await axios.post(`${process.env.REACT_APP_KMACK_URL}/kmac/jwt?id=${username}`);
            this.token = resp.data["jwt"];
        } catch (error) {
            NotificationManager.error('Username not found', 'Error', 3000);
        }
    }
}

export default KmackManager;