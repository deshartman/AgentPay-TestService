/**
 * This is the outbound to PSTN voice handler that routes the call from the Customer to a PSTN destination.
 * 
 * * The PSTN side call SID needs to be extracted from the PBX side call SID, using Twilio API for PArent SID, so Pay can be attached.
 * 
 *
 * Once the call is connected, we call the StatusCallback and pass the UUI information.
 * 
 */
exports.handler = function (context, event, callback) {

    const voiceResponse = new Twilio.twiml.VoiceResponse();

    try {
        // console.log(`Dialing ${to} with Caller ID ${from} - Was to:${event.To} from:${event.From}`);
        const dial = voiceResponse.dial({ callerId: from });
        dial.number(
            {
                // Only update Sync when call is answered
                statusCallbackEvent: 'answered',
                statusCallback: context.SERVER_URL,
                statusCallbackMethod: 'POST'
            },
            to);

        callback(null, voiceResponse);
    } catch (error) {
        callback(`Error with OutboundHandler: ${error}`, null);
    }
};
