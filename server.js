var fs = require('fs');
var validator = require('xsd-schema-validator');

var express =   require("express");
var multer  =   require('multer');
var app         =   express();

var storage =   multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        var date = new Date();
        var day=date.getDate();
        var month=date.getMonth();
        var year=date.getFullYear();
        var h = date.getHours();
        var m=date.getMinutes();
        var s=date.getSeconds();
        name="";
        for(var i=0;i<file.originalname.length;i++){
            if(file.originalname[i]=="."){break;}else{
                name=name+file.originalname[i];
            }
        }

        filename=name+'_'+day+'-'+month+'-'+year+'_'+h+'-'+m+'-'+s+".xml";
        callback(null, filename );
    }
});

var upload = multer({ storage : storage, fileFilter: fileFilter }).single('xmlFile');
var name="";
var Message=null;
var SystemMessage=null;

app.get('/',function(req,res){
    res.sendFile(__dirname + "/index.html");
<<<<<<< HEAD

=======
    name="";
>>>>>>> c3d016043011faa60780b2915139a9cd55b9314d
});

app.post('/checkxml',function(req,res){

    Message=null;
    SystemMessage=null;

    upload(req,res,function(err) {
        if(err) {
            console.log(err);
            res.end(err.toString());
        }else {
            waitForMessage(res);
        }
    });
});

function waitForMessage(res){
    if (Message==null){
        setTimeout(function () {
            waitForMessage(res);
        },500);
    }else{
        if (SystemMessage!="404") {
            res.end(Message + "\n\n" + SystemMessage);
        }else{
            res.status(404).end("HTTP 404\n\n"+Message);
            process.exit(0);
        }
    }
}

function fileFilter (req, file, cb) {

    if(file.mimetype=="text/xml"){
        console.log("Received new request for checking xml file: "+  file.originalname );
        cb(null, true);
        checkFileExist(filename);
    }
    else{
        console.log("The file: "+file.originalname+" has an invalid file type of : "+file.mimetype+" . Please upload a xml file");
        cb(new Error('Invalid file type, file not uploaded.'));
        Message="The file: "+file.originalname+" has an invalid file type of : "+file.mimetype+" . Please upload a xml file";
        SystemMessage="";
    }
}

function readXML(filename){

    fs.open('./uploads/'+filename, 'r', function(err, fd)  {

        xml = fs.readFileSync('./uploads/'+filename);
        xmlStr = fs.readFileSync('./uploads/'+filename).toString();
        // console.log("*****Test xml check: ***** \n"+xmlStr+"\n\n***filename: "+filename);

        /*******************************************
         Obtaining the name of the schema file (if any)
         ********************************************/

        xmlStrTemp = xmlStr.replace(/<!--[\s\S]*?-->/g, '');
        // console.log("*****Test xml check2: ***** \n"+xmlStrTemp);
        var n = xmlStrTemp.includes("xsi:schemaLocation") || xmlStrTemp.includes("xsi:noNamespaceSchemaLocation");
        if(n){
            var k = xmlStrTemp.search(".xsd\"");
            if (k<0){
                var k = xmlStrTemp.search(".xsd\'");
            }
            for (var i = k; i >1; i--) {
                if (xmlStrTemp[i]=="\"" || xmlStrTemp[i]=="\'" || xmlStrTemp[i]==" " ) {
                    var xsdSchema=xmlStrTemp.slice(i+1,k+4);
                    console.log("Will attemp to read schema file:  "+xsdSchema);
                    break;
                }
            }
        }else{

            var xsdSchema='order_details.xsd';
            console.log("Schema not specified in xml file, Will attempt to read default schema file:  "+xsdSchema);
        }

        /*******************************************
         Checking if xsd file exists
         ********************************************/

        fs.access("./schemas/"+xsdSchema, fs.R_OK, function (err) {
            if (err){
                console.log("Schema file "+xsdSchema+ " not found, validation incomplete");
                console.log(err);
                Message="***Schema file "+xsdSchema+ " not found, validation incomplete***";
                SystemMessage="404";

            }else{
                console.log("Schema file found, validating now.......");

                /*******************************************
                 Validating the xml file using xsdSchema file
                 ********************************************/
                validator.validateXML(xmlStr, "./schemas/"+xsdSchema, function(err, result) {
                    if (err) {
                        console.log("\n ***Error during xml validation***");
                        console.log(err);

                        Message="***Error during xml validation***";
                        SystemMessage=err;
                    }
                    if(result.valid) {
                        console.log("Validation Successful. \n\nThe content of the xml file is as follows:\n ");
                        console.log(xmlStr);
                        Message="The file "+name+".xml"+" is valid \n\nThe content of the xml file is as follows:\n ";
                        SystemMessage=xmlStr;
                    }
                });
            }
        });
    });
}

/************************************************************
 Recurring Function to make sure upload of xml is complete
 ***********************************************************/
function checkFileExist(filename){
    fs.access('./uploads/'+filename, fs.R_OK, function (err) {
        if (err){
            setTimeout(function () {
                checkFileExist(filename);
            },100);

        }else{
            setTimeout(function () {
                readXML(filename);
            },500);

        }
    });
}

app.listen(8081,function(){
    console.log("Server Listening at http://127.0.0.1:8081");
    console.log("***********************************\n");
});