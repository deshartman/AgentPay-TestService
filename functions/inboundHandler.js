/**
 * This is the inbound from PSTN voice handler that routes the call to the Customer destination.
 * 
 *  The PSTN side call SID is sent via callback, so Pay can be attached. 
 * 
 * Once the call is connected, we call the StatusCallback and pass the call information.
 */
exports.handler = async function (context, event, callback) {

    const voiceResponse = new Twilio.twiml.VoiceResponse();

    // Send to SIP user -> sip:+number@SIP_DOMAIN?User-to-User=CAxxxxx
    const sipTo = event.To + '@' + context.SIP_DOMAIN + '?' + 'User-to-User=' + event.CallSid;

    try {
        // console.log(`Dialing ${to} with Caller ID ${from} - Was to:${event.To} from:${event.From}`);
        const dial = voiceResponse.dial({ callerId: from });
        // Dial SIP URL and when answered, call the callback URL
        dial.sip(
            {
                // Only update Sync when call is answered
                statusCallbackEvent: 'answered',
                statusCallback: context.SERVER_URL,
                statusCallbackMethod: 'POST'
            },
            sipTo);

        callback(null, voiceResponse);
    } catch (error) {
        callback(`Error with InboundHandler: ${error}`, null);
    }

};