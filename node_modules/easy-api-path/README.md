
# Create API URLs or Endpoints for NodeJS application without create custom router



## Installation

Install "easy-api-path" with npm

```bash
  npm install easy-api-path
```

Install "easy-api-path" with yarn

```bash
  yarn add easy-api-path
```
    
## Usage/Examples

Create controllers inside "controllers" directory 
```javascript
// import package "easy-api-path"
const apiPath = require('easy-api-path');

// import your main app
const {app} = require('../../../../app');

// Don't use express.Router()
// Don't need to write custom path, eg: "/api/v1/create/user"
// create a route path by using "apiPath(__filename)"
// "apiPath(__filename)" generate same "/api/v1/create/user"

app.post(apiPath(__filename), (req, res) => {
    // your custom code...
    res.send(`WOW, It's working...`);
});
```


## Tech Stack

**Server:** Node, Express


## Author

- [@Rohit Kumar Singh](https://github.com/RohitSinghIT/api-path)

