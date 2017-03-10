# XML XSD validation Over Web Client
-----------------------------------

**A simple web client that allows users to upload a xml file that is validated by the schema file already located in the server schema directory**

## How to Run the application 

* Download and install the latest NodeJS. If NodeJS is already installed, 
continue from step 2. 
* Download the files in a directory 
* Run command prompt(cmd) from that directory 
* In cmd, write 
  `npm install` 
and press enter to install all the dependencies 
* After all dependencies have been installed< in cmd, write again 
  ```node server.js```
and press enter to run the server 
* Once server is running, in any browser go to `http://localhost:8081` to upload and validate 
xml files 

_N.B: The schema files must be kept in the folder named schema. If no schema file 
name is mentioned in the xml file, it uses a default schema file called 
“order_details”_

## Design of the Application 

The application was built using NodeJS. The objective of the NodeJS based app 
was to accept a xml file through a web client which the server validates against 
the specified schema file and then conveys the result back to the web client. 
There were three main packages used to build this app: express, multer and xsd-
schema-validator. Express was used to easily build the client web interface. 
Multer was used to handle and store file upload. xsd-schema-validator was used 
to validate the uploaded xml file against the specified xsd schema file. 
 

 ![picture alt](https://github.com/abhijd88/XML_XSD_validation_OverWebClient/blob/master/Application_Architecture.png "Application Architecture & Program Flow")

__Figure 1: Application Architecture & Program Flow__ 

Package xml-parser was used briefly to parse the xml file into a javascript object 
to find the name of the schema file inside the xml file. Later, this package was 
uninstalled because this package has 51 dependencies. Instead only 13 lines of 
code was added that can find the name of the schema file inside the xml file. 
The package xml-parser would be very useful for implementing further complex 
tasks with the xml file content but for only finding the name of the schema file, 
it seemed to have too high overhead. 
