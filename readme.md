## Getting Started

Once you created the account, Copy your [apy-token] and paste in [server.js](https://github.com/iamspathan/apyhub-email-validation-tutorial/blob/main/server.js):

```
const response = await axios.post('https://api.apyhub.com/validate/email/dns', { email }, {
      headers: {
        'apy-token': 'ADD-YOUR-UNIQUE-APY-TOKEN',
        'Content-Type': 'application/json'
      }
    });

```

Run the development server:

```
node server.js

```

You will see the below message in console.

```
Server started on port 3000
Connected to database

```

Open [/index.html](https://github.com/iamspathan/apyhub-email-validation-tutorial/blob/main/index.html)


