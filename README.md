# API

This is an API that connects to MongoDB. This API serves to transfer data between survey-builder, participant-app, and Qualtrics surveys.

---

Table of Contents 

- [API Instruction](#instruct)
- [Development Tips](#tips)
- [Deploy to Heroku](#heroku)

---

<a name="instruct"/>

### API Instruction ###

Structure of MongoDB Atlas: 
We use a Cluster. A Cluster consists of Databases, and a Database consists of Collections, and each Collection stores Documents. Each Document has Entries. 

Notation: 
For ```/:xx```, the ```xx``` that follows the semicolon denotes a variable that you can change when you use this API. Example: ```/:db```. The db here is short for database, and if you wish to access the database named "test", you would put ```/test``` as a snippet in the route. 

For simplicity, the routes mentioned below are rooted on **https://test-api-615.herokuapp.com/api**. For instance, in the first bullet point below, you would actually request from **https://test-api-615.herokuapp.com/api/:db/collections**. 

For all examples mentioned below, say we have a database named ```demoDB```, four collections in that database named ```demoCol```, ```demoCol2```, ```demoCol-1```, and ```demoCol-2```. Inside ```demoCol```, there are two documents: ```{ "name": "StormTrooper", "color": "white", "actions": [{"1": "shoot"}] }``` and ```{ "name": "LukeSkywalker", "color": "blue", "actions": [] }```.


GET: 

- Get collection names: **/:db/collections** (cols.js)
    - Example: GET from **/demoDB/collections** returns ```["demoCol", "demoCol2"]```

- Get documents from a collection: **/feedback/:db/:col** (getCol.js)
    - Example: GET from **/feedback/demoDB/demoCol** returns ```[{ "name": "StormTrooper", "color": "white", "actions": [{"1": "shoot"}] }, { "name": "LukeSkywalker", "color": "blue", "actions": [] }]```

- Get a specific document from a collection: **/feedback/:db/:col/:key-:value** (getColEntry.js)
    - Example: GET from **/feedback/demoDB/demoCol/color-blue** returns ```{ "name": "LukeSkywalker", "color": "blue", "actions": [] }```

POST:

- Create a new collection: **/:db/createCol/:newCol** (createCol.js)
    - Example: POST to **/demoDB/createCol/demoCol3** will create a new collection named ```demoCol3```

- Create a new document in a collection: **/feedback/:db/:col** (postColEntry.js)
    - Example: POST to **/demoDB/demoCol** with body ```{ "name": "C3PO", "color": "yellow", "actions": [] }``` will insert that document into demoCol. 

PUT: 

- Change the content of a document: **/feedback/:db/:col/:key-:value** (putColEntry.js)
    - Example: PUT to **/feedback/demoDB/demoCol/name-StormTrooper** with body ```{"actions": [{"2": "biubiubiu"}]}``` will change the document to ```[{ "name": "StormTrooper", "color": "white", "actions": [{"2": "biubiubiu"}] }``` This action changes a specific entry within the document. 
    - Example: PUT to **/feedback/demoDB/demoCol/name-StormTrooper** with body ```{ "height": "unknown"}``` will change the document to ```[{ "name": "StormTrooper", "color": "white", "actions": ["shoot"], "height": "unknown" }```

- Append to an array in a document's entry: **/feedback/:db/:col/:key-:value/:index** (putColEntryItem.js)
    - Example: PUT to **/feedback/demoDB/demoCol/name-StormTrooper/actions** with body ```{"2": "biubiubiu"}``` will change the document to ```{ "name": "StormTrooper", "color": "white", "actions": [{"1": "shoot"}, {"2": "biubiubiu"}] }```

- Update an element in an array in a docoument's entry: **/feedback/:db/:col/:key-:value/:index/:keyy-:valuee/:infoType** (putColEntryPutItem.js)
    - Example: PUT to **/feedback/demoDB/demoCol/name-StormTrooper/acions/1-shoot/accuracy** with body ```{"accuracy": "30%"}``` will change the "StormTrooper" document to ```{ "name": "StormTrooper", "color": "white", "actions": [{"1": "shoot", "accuracy": "30%"}] }```

DELETE:

- Delete a specific document from a collection: **/feedback/:db/:col/:key-:value** (deleteColEntry.js)
    - Example: DELETE from **/feedback/demoDB/demoCol/name-LukeSkyWalker** will delete the document with entry ```"name": "LukeSkywalker"```

- Delete one / multiple collection(s): **/feedback/:db/:option** (deleteCols.js)
    - Note that **option** can either be ```one``` or ```all```
    - Example: **option** == ```one```: DELETE from **/feedback/demoDB/one** with body ```{"colName": "demoCol2"}``` will delete the ```demoCol2``` collection in ```demoDB``` database. 
    - Example: **option** == ```all```: DELETE from **/feedback/demoDB/all** with body ```{"studyName": "demoCol"}``` will delete ```demoCol-1``` and ```demoCol-2``` collections.

- Delete an element in an array in a document: **/feedback/:db/:col/:key-:value/:index/:keyy-:valuee** (deleteColEntryDeleteItem.js) 
    - Example: DELETE from **/feedback/demoDB/demoCol/name-StormTrooper/actions/1-shoot** will delete the ```{"1": "shoot"}``` element from the ```actions``` array in the document with entry ```"name": "StormTrooper"```


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
---

<a name="tips"/>

### Development Tips ###

In ./server.js, change the ```ENV``` variable to run localhost. Use ```curl``` or "Postman" to test out endpoints. 

Make sue to use ```client.close()``` to close any connection that you have opened in any route. 

Change the ```ENV``` variable to ```prod``` when you are ready to push changes (this will tell the app to run on heroku's server). 

---

<a name="heroku"/>

### Deploy to Heroku ###

First, [install Heorku CLI](https://devcenter.heroku.com/articles/heroku-cli)

Use psychApp2020@gmail.com credentials to log in to heroku cli. 

When you are ready to push changes, use ```heroku git:remote -a test-api-615``` to link ur local repo to the API app (test-api-615) on heroku.  

NOTE: Instead of using ```git push heroku master```, please use ```git push heroku main:master``` to build the app because we are using the ```main``` branch for development, but heroku is initially set up with ```master```. Using ```main:master``` forces heroku to build based on the ```main``` branch.

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