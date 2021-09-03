[![Coverage Status](https://coveralls.io/repos/github/VirtuoWorks/Node/idylisapi/badge.svg?branch=main)](https://coveralls.io/github/VirtuoWorks/Node/idylisapi?branch=main)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/Naereen/StrapDown.js/graphs/commit-activity)
[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/Naereen/StrapDown.js/blob/master/LICENSE)
[![Github all releases](https://img.shields.io/github/downloads/Naereen/StrapDown.js/total.svg)](https://GitHub.com/Naereen/StrapDown.js/releases/)

# Introduction
An easy to use API to communicate with [Idylis](https://www.idylis.com/index)' API.
It can be used to find, update or insert a document on Idylis in a very straightforward and developer friendly way.
This API was developed in order to facilitate the communication between any given API and Idylis. 
One only needs to be in possession of their credentials to connect to Idylis to use this API.
_**Please note that basic knowledge of the way Idylis functions is necessary to take full advantage of the different available methods.**_

## What can we do with idylisapi?

- **Get** an authorization token from Idylis
- **Find** a document on Idylis
- **Insert** a document on Idylis
- **Update** a document on Idylis

## Installing idylisapi

To add idylisapi to your project, just type the following command at the root of your project:

```bash
npm install @virtuoworks/idylisapi
```

## Creating the object idylisapi

To be able to utilize the different methods provided by IdylisAPI, you first need to create the object that will contain all the methods by adding the following lines to your code:

```javascript
import idylisapi from 'idylisapi';

const idylisapi = idylisapi(
  'https://exe.idylis.com//Idylisapi.asmx', /* This is the default address to get
  the WSDL from Idylis, but you might want to change it if, say, you choose
  to use a proxy between your API and Idylis */
  'CODEABONNE', /* This is your 'code abonné' parameter, which is basically
  your account name on Idylis */
  'IDENTIFIANT', /* This is your 'identifiant' parameter, which represents
  the username */
  'MOTDEPASSE', /* This is the password you use to connect to your Idylis
  account */
  'https://www.idylis.com/Idylisapi.asmx/', /* This is the default API end point
  to make calls to Idylis API. You may choose to use a different one */
);
```

## Getting an authorization token from Idylis

In order to obtain an authorization token, required to make API calls to Idylis API, we are going to use the method ```getAuthToken()```. This method does not require any argument, and will return a valid token that can be used to make API calls to Idylis. [^1]

```javascript
const authorizationToken = await idylisapi.getAuthToken();
```

[^1]: *please note that you do not need to use this method before using other methods, such as ```insertDocument()``` or ```findDocument()```, for these methods already call ```getAuthToken()```.*

## Finding a document on Idylis

The idylisapi object has a method called ```findDocument()``` which allows to find a given document on Idylis. To do so, ```findDocument()``` requires certain arguments to function. The arguments are as follow:

| Argument | Explanation |
| -------- | ----------- |
| **docType** | The type of document that will be retrieved from Idylis API (example: 'FA_DEVIS', 'FA_BL', etc). |
| **searchCriteria** | The criteria that will be used to retrieve one or more document(s) from Idylis API (example: 'DATECREATION', 'CODEDEVIS', etc). |
| **operator** | The assignment operator used for the search **(possible choices: '=', '>=', '<=', '<', '>')**. |
| **criteriaValue** | The value that will be used along with the search criteria (example: 'PI2105033', '03/12/2020', etc. _**Please note that the date format must be dd/MM/yyyy**_). |
| **orderingType** | The criteria with which the documents will be ordered in the response (example: 'DATECREATION', 'CODEDEVIS', etc). |
| **orderingValue** | The value that will be used along with the ordering type **(possible choices: 'ASC', 'DESC')**. |
| **subTable** | Allows to choose whether sub tables will be present in the response or not **(possible choices: 0, 1)**. |
| **enclosedDoc** | Allows to choose whether enclosed documents will be present in the response or not **(possible choices: 0, 1)**. |
| **withCompression** | Allows to choose whether the response will be compressed or not **(possible choices: 0, 1)**. |

This method returns either a boolean if the document couldn't be found on Idylis, or the raw document itself under the form of a string if it was successfully retrieved from Idylis.

## Inserting a document on Idylis

The idylisapi object has a method called ```insertDocument()``` which allows to insert a document on Idylis. This method allows you to insert one document, or one document and its sub document, for instance a quotation (FA_DEVIS) and its related products (FA_DETAILARTICLEDEVIS).
To do so, ```insertDocument()``` requires certain arguments to function. The arguments are as follow:

| Argument | Explanation |
| -------- | ----------- |
| **mainDocType** | The code which represents the type of document that will be sent to Idylis API (example: 'FA_DEVIS', 'FA_BL', etc). |
| **mainDocFieldsArray** | An array containing objects of pair key value representing the field as the key and the value of that field as the value. _Please note that some fields are required. For instance for a quotation, the following fields are required at minimum: CODECLIENT, CODEDEVIS, MODELEDOC, DATECREA. Please also note that the totals must be calculated precisely and correspond exactly to what is expected by Idylis._ The rest of the fields depend on your personal configuration of Idylis. EXP_ fields should not be included. |
| **[subDocType]** | The code which represents the sub document which will be added to the main document, if any. Leave empty if not required. |
| **[subDocFieldsArray]** | An array containing objects of pair key value representing the fields to be used to create the sub document. Leave empty if not required. |

This method returns a boolean that will give confirmation or denial about whether the insertion(s) was successful or not.

## Updating a document on Idylis

The idylisapi object also has a method called ```udpateDocument()``` which allows to find a given document on Idylis. To do so, ```udpateDocument()``` requires certain arguments to function. The arguments are as follow:

| Argument | Explanation |
| -------- | ----------- |
| **docType** | The type of document that will be retrieved from Idylis API (example: 'FA_DEVIS', 'FA_BL', etc). |
| **searchCriteria** | The criteria that will be used to retrieve one or more document(s) from Idylis API (example: 'DATECREATION', 'CODEDEVIS', etc). |
| **operator** | The assignment operator used for the search **(possible choices: '=', '>=', '<=', '<', '>')**. |
| **criteriaValue** | The value that will be used along with the search criteria (example: 'PI2105033', '03/12/2020', etc. Please note that date format must be dd/MM/yyyy). |
| **orderingType** | The criteria with which the documents will be ordered in the response (example: 'DATECREATION', 'CODEDEVIS', etc). |
| **orderingValue** | The value that will be used along with the ordering type **(possible choices: 'ASC', 'DESC')**. |
| **subTable** | Allows to choose whether sub tables will be present in the response or not **(possible choices: 0, 1)**. |
| **enclosedDoc** | Allows to choose whether enclosed documents will be present in the response or not **(possible choices: 0, 1)**. |
| **withCompression** | Allows to choose whether the response will be compressed or not **(possible choices: 0, 1)**. |
| **primaryKey** | The primary key necessary to update any table (example: 'REFBL' for delivery notes or 'REFDEVIS' for quotations). |
| **tableUpdateArray** | An array containing objects of pair key value representing the table to be updated as the key and the value to be updated as the value. |

This method returns a boolean that will give confirmation or denial about whether the update was successful or not.