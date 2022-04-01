// import { notifySlack } from '../slackNotify';
describe('slackNotify tests', () => {
    const sendSpy = jest.fn();
    jest.doMock('slack-notify', () => () => ({
        send: sendSpy
    }));
    it('should call notifySlack function', async () => {
        const { notifySlack } = require('../slackNotify');

        let username = 'doe@wednesday.is';
        let message = 'Work done!';
        notifySlack(username, message);
        expect(sendSpy).toBeCalledWith(
            expect.objectContaining({
                text: JSON.stringify(message),
                username
            })
        );
        notifySlack(username, message);
    });
});
