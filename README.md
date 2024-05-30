# Fake ChatGPT messenger

I've created a fake ChatGPT clone called JuryGPT for Ditch Day 2024 at Caltech. I took the UI from OpenAI's ChatGPT and stripped it of JavaScript. Then, I replaced it with custom socket.io code to create a chatbot where you talk to the admin.

This scenario was at the end of a puzzle hunt where individuals have just gotten the URL to this site and realized the jury for their trial is ChatGPT (AI taking everyone's jobs...)

To pretend to be JuryGPT:
- Select a car
- Type "secretpassword"
- Any messages sent after will be sent as JuryGPT
- You can receive messages from the person who thinks they're in a trial.

As a user:
- Select a car (probably the same one)
- Now you can send messages as the user who thinks they're amidst a trial.

## Test locally

```
npm install
npm start
```

## Deployment

This is set up with a Dockerfile and a fly.toml so that it can be deployed on fly.io!