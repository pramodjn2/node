var http = require('http');
var app = module.exports = require('express')();
var bodyParser = require("body-parser");
var mysql = require('mysql'); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "otboo"
});

con.connect((err) => {
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

var port = process.env.PORT || 8080;

app.get('/', function (req, res) {
   res.send('Hello World');
})

app.post('/users', function(req, res) {
    var body = req.body;
    
    var user_id = body.user_id;
    var patient_id = body.patient_id;
    var lat = body.lat;
    var lang = body.lang;
   
    var sql = "select a.*,ap.name,ap.mobile,ap.gender,ap.age,mas.name as appointment_status_name from appointment as a LEFT JOIN user u ON u.id = a.user_id LEFT JOIN appointment_patient AS ap ON ap.appointment_id = a.id LEFT JOIN manage_appointment_status AS mas ON mas.id = a.appointment_status";
    if(patient_id != ''){
        sql += " where a.user_id = "+patient_id; 	
    }
   
    con.query(sql, function (err, result, fields) {
    if (err) throw err;
    var data = [];
    for(var i=0; i<result.length; i++){
		var myArray={};	
		myArray.name   = result[i].name;
		myArray.mobile = result[i].mobile;
		myArray.gender = result[i].gender;
		myArray.age    = result[i].age;
		myArray.appointment_id = result[i].id;

		myArray.appointment_date = result[i].appointment_date ;
		myArray.appointment_time = result[i].appointment_date_time;
		myArray.booking_id = result[i].booking_id  ;
		myArray.appointment_status = result[i].appointment_status_name;
		myArray.appointment_type = result[i].appointment_type ; 
		myArray.is_online_payment_accept = result[i].is_online_payment_accept;
		myArray.doctor_id = result[i].doctor_id;
		myArray.clinic_id = result[i].clinic_id;
		myArray.trans_id = "0";
		myArray.payment_status = "unpaid";
         
        var date = new Date(result[i].create_dt*1000);
        var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        var year  = date.getFullYear();
		var month = months_arr[date.getMonth()];
	    var day   = date.getDate();

	    var hours   = date.getHours();
        var minutes = "0" + date.getMinutes();
		var seconds = "0" + date.getSeconds();
        
        var ampm = hours >= 12 ? 'PM' : 'AM'; hours = hours % 12;
			hours = hours ? hours : 12; // the hour '0' should be '12'
			minutes = minutes < 10 ? '0' + minutes : minutes;

    	myArray.booking_date = day+' '+month+' '+year;
		myArray.booking_time = hours + ':' + minutes.substr(-2) + ':' + ampm;
	
        var clinic_data = { 'clinic_id': result[i].clinic_id, 'lat': lat, 'lang': lang};

		/*myArray.name=result[i].name;
		myArray.name=result[i].name;
		myArray.name=result[i].name;
		myArray.name=result[i].name;
		myArray.name=result[i].name;
		myArray.name=result[i].name;
		myArray.name=result[i].name;
		myArray.name=result[i].name;
		myArray.name=result[i].name;
		myArray.name=result[i].name;*/

		data.push(myArray);
    }
    res.send(data);
  });
});


       



http.createServer(app)
    .listen((port), function() {
    console.log("Listening on localhost:" + port);
});