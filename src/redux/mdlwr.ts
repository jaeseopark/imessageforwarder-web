// import { createAsyncThunk } from "@reduxjs/toolkit";
import { Dispatch } from "redux";
import IMFClient from "../client/imf";
import IMFMessage from "../typedef/IMFMessage";
import { addMessage, addPeople, updateMessage } from "redux/transcript/slice";
import { updateConnectivity as updateSliceConnectivity } from "redux/connectivity/slice";

let imfClient: IMFClient;

export const initializeClient = () => (dispatch: Dispatch) => {
    const host = process.env.REACT_APP_SERVER_HOST!;
    const port = process.env.REACT_APP_SERVER_PORT!;
    const client = new IMFClient(host, port);
    client.setOnMessage((msg) => {
        if (msg.status === "received") {
            dispatch(addMessage(msg));
        } else {
            dispatch(updateMessage(msg));
        }
    });
    client.setOnError((error) => {
        // TODO: deal with this
    });

    client.fetchContacts().then((people) => dispatch(addPeople(people)));

    imfClient = client;
};

export const sendMessage = (msg: IMFMessage) => (dispatch: Dispatch) => {
    dispatch(addMessage(msg));

    const sendToServer = () => {
        if (imfClient) imfClient.sendMessage(msg);
        else setTimeout(sendToServer, 1000);
    };
    sendToServer();
};

export const updateConnectivity = () => (dispatch: Dispatch) => {
    if (imfClient) {
        dispatch(updateSliceConnectivity(imfClient.isOnline()));
    }
};