import slackNotify from 'slack-notify';

let slack;

export async function notifySlack(username, message) {
    if (!slack) {
        slack = slackNotify(process.env.SLACK_WEBHOOK_URL);
    }

    slack.send({
        text: JSON.stringify(message),
        username
    });
}
