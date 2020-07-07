### API INSTRUCTION ###

Structure of MongoDB Atlas: 
We use a Cluster. A Cluster consists of Databases, and a Database consists of Collections, and each Collection stores Documents. Each Document has Entries. 

Notation: 
For ```/:xx```, the ```xx``` that follows the semicolon denotes a variable that you can change when you use this API. Example: ```/:db```. The db here is short for database, and if you wish to access the database named "test", you would put ```/test``` as a snippet in the route. 

For simplicity, the routes mentioned below are rooted on **https://test-api-615.herokuapp.com/api**. For instance, in the first bullet point below, you would actually request from **https://test-api-615.herokuapp.com/api/:db/collections**. 

For all examples mentioned below, say we have a database named ```demoDB```, two collections in that database named ```demoCol``` and ```demoCol2```. Inside ```demoCol```, there is a document: ```{ "name": "StormTrooper", "color": "white", "actions": [{"1": "shoot"}] }``` and ```{ "name": "LukeSkywalker", "color": "blue", "actions": [] }```.


GET: 

- Get collection names: **/:db/collections**
    - Example: GET from **/demoDB/collections** returns ```["demoCol", "demoCol2"]```

- Get documents from a collection: **/feedback/:db/:col**
    - Example: GET from **/feedback/demoDB/demoCol** returns ```[{ "name": "StormTrooper", "color": "white", "actions": [{"1": "shoot"}] }, { "name": "LukeSkywalker", "color": "blue", "actions": [] }]```

- Get a specific document from a collection: **/feedback/:db/:col/:key-:value**
    - Example: GET from **/feedback/demoDB/demoCol/color-blue** returns ```{ "name": "LukeSkywalker", "color": "blue", "actions": [] }```

POST:

- Create a new collection: **/:db/createCol/:newCol**
    - Example: POST to **/demoDB/createCol/demoCol3** will create a new collection named ```demoCol3```

- Create a new document in a collection: **/feedback/:db/:col**
    - Example: POST to **/demoDB/demoCol** with body ```{ "name": "C3PO", "color": "yellow", "actions": [] }``` will insert that document into demoCol. 

PUT: 

- Change the content of a document: **/feedback/:db/:col/:key-:value**
    - Example: PUT to **/feedback/demoDB/demoCol/name-StormTrooper** with body ```{"actions": [{"2": "biubiubiu"}]}``` will change the document to ```[{ "name": "StormTrooper", "color": "white", "actions": [{"2": "biubiubiu"}] }``` This action changes a specific entry within the document. 
    - Example: PUT to **/feedback/demoDB/demoCol/name-StormTrooper** with body ```{ "height": "unknown"}``` will change the document to ```[{ "name": "StormTrooper", "color": "white", "actions": ["shoot"], "height": "unknown" }```

- Append to an array in a document's entry: **/feedback/:db/:col/:key-:value/:index**
    - Example: PUT to **/feedback/demoDB/demoCol/name-StormTrooper/actions** with body ```{"2": "biubiubiu"}``` will change the document to ```{ "name": "StormTrooper", "color": "white", "actions": [{"1": "shoot"}, {"2": "biubiubiu"}] }```

DELETE:

- Delete a specific document from a collection: **/feedback/:db/:col/:key-:value**
    - Example: DELETE from **/feedback/demoDB/demoCol/name-LukeSkyWalker** will delete the document with entry ```"name": "LukeSkywalker"```


Example code: 
```
import axios from "axios";
axios
    .get('https://test-api-615.herokuapp.com/api/feedback/demoDB/demoCol');
    .then(res => {
        console.log(res);
    })
```
returns:
```
[
    { 
    "name": "StormTrooper", 
    "color": "white", 
    "actions": [
            {
                "1": "shoot"
            }
        ] 
    }, 
    { 
    "name": "LukeSkywalker", 
    "color": "blue", 
    "actions": [

        ] 
    }
]
```







### Dev Log ###

Login to heroku with ```heroku login```

Set up package.json first with: ``` npm init ```

Create index.js ``` touch idex.js ```

To run, ``` node index.js ```

Install express and other dependencies:
```
# to use nodemon anywhere on computer:
npm install -g nodemon
# to install libraries in project directory
npm install mongodb express body-parser cors --save
```
Note: body-parser takes input from requests and provides ways to use them. cors allows you to access resources cross-domain. cors is not super necessary for this particular api as there will not be any frontend for now.  

Use postman to test out sending requests. Note that when you do POST or DELETE, select body - raw, and then write a json data etry. Click into 'code', make sure that the cotent type is application/json. 

We want to model our data so that our data has the same structure (schema) across apps. This is when mongoose comes in. Run the following to install dependencies. (mongodb-uri) is used so that we can connect to mongodb. 
```
npm install mongoose mongodb-uri --save
```
Schema is in api/demoEntries/model/demoEntry.js

At this point, I've also created an app on heroku with 
```
heroku create test-api-615
# now add mongodb
heroku addons:create mongolab
```

Go to heroku website, enter our app test-api-615, click on mongodb addon to access mLab website. Under Users, create a new user with credentials: 
```
username: user
password: p123456
```

Installed mongodb community edition with homebrew. 
```
brew tap mongodb/brew
brew install mongodb-community@4.2
```
You can use the mongo shell credentials on mongodb to access the database through command line.

6/18
About to a functionality that lets researchers create collections on mongodb and connect with that collection.

Add mongodb nodejs driver to connect to mongodb atlas
``` 
npm install mongodb 
npm update
```

Run the following and start building jwt user authentication into api.  
```
npm i bcryptjs body-parser concurrently express is-empty jsonwebtoken mongoose passport passport-jwt validator --save
```

Install the following dependencies to enable user authentication:
```
npm i bcryptjs body-parser concurrently express is-empty jsonwebtoken mongoose passport passport-jwt validator --save
```