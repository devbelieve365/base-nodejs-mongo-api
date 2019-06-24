import FCM from 'fcm-node'
import {FCM_SERVER_KEY} from "../config/config";

const fcm = new FCM(FCM_SERVER_KEY);

export const sendFCM = (registrationIds, notification) => {
    if (!registrationIds || !registrationIds.length) return;
    registrationIds.forEach((registrationId) => {
        const message = {
            to: registrationId,
            notification
        };
        fcm.send(message, function(err, response){
            if (err) {
                console.log("Something has gone wrong!");
            } else {
                console.log("Successfully sent with response: ", response);
            }
        });
    });

};