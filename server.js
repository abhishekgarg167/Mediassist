var express=require("express");
var mysql=require("mysql");
var app=express();


var dbConfigObj={
    host:"localhost",
    user:"root",
    password:"",
    database:"project"
}
var dbcon=mysql.createConnection(dbConfigObj);
dbcon.connect(function(err){
    if(err)
        console.log(err.message);
    else
        console.log("Connected Successfully");
})
app.use(express.static("public"));
var path=require("path");
var fileuploading=require("express-fileupload");
const e = require("express");
app.use(fileuploading());
app.use(express.urlencoded({extended:true}));

app.get("/",function(req,resp){
    var fullpath=path.join(process.cwd()+"/public","index.html");
    resp.sendFile(fullpath);
})



app.get("/ajax-insert",function(req,resp){
    //var data=[req.query.anyid]
    
    dbcon.query("insert into users values(?,?,?,?,current_date())",[req.query.vid,req.query.vpwd,req.query.vmob,req.query.vmed,req.query.date],function(err,res){
        if(err){
            resp.send("error");
            console.log(err.message);
        }
        else{
            resp.send(res);
        }
    })
})
app.get("/ajax-check-uid",function(req,resp){
    //var data=[req.query.anyid]
    dbcon.query("select*from users where email=?",[req.query.anyid],function(err,res){
        resp.send(res);
    })
})
app.get("/ajax-check-user",function(req,resp){
    //var data=[req.query.anyid]
    dbcon.query("select*from users where email=? and pwd=?",[req.query.vid,req.query.vpwd],function(err,res){
        resp.send(res);
    })
    
})
app.post("/profile-process",function(req,resp){
    
    if(req.files==null){
        req.body.picname="nopic.png"
    }
    else{
        req.body.picname=req.files.ppic.name;
        var uploadingPath=path.join(process.cwd(),"public","uploads",req.files.ppic.name);
        req.files.ppic.mv(uploadingPath,function(err){
            if(err)
                console.log(err);
            else
                console.log("Uploaded");
        });
    }
    var data=[req.body.txtemail,req.body.txtname,req.body.txtmob,req.body.txtaddr,req.body.txtcity,req.body.txtadhr,req.body.picname];
    dbcon.query("insert into profiles values(?,?,?,?,?,?,?)",data,function(err){
        if(err)
            resp.write(err.message);
        else
            resp.write("Data Saved");
        resp.end();
    })
})
app.post("/profile-process-update",function(req,resp){
    if(req.files==null){
        req.body.picname=req.body.savedpic;
    }
    else{
        req.body.picname=req.files.ppic.name;
        var uploadingPath=path.join(process.cwd(),"public","uploads",req.files.ppic.name);
        req.files.ppic.mv(uploadingPath,function(err){
            if(err)
                console.log(err);
            else
                console.log("Uploaded");
        });
    }
    var data=[req.body.txtname,req.body.txtmob,req.body.txtaddr,req.body.txtcity,req.body.txtadhr,req.body.picname,req.body.txtemail];
    dbcon.query("update profiles set name=?,contact=?,address=?,city=?,acard=?,picname=? where email=?",data,function(err){
        if(err)
            resp.write(err.message);
        else
            resp.write("Data Saved");
        resp.end();
    })
})

app.post("/needy-profile-process",function(req,resp){
    var data=[req.body.txtemail,req.body.txtname,req.body.txtaddr,req.body.txtcity,req.body.txtadhr];
    dbcon.query("insert into needy values(?,?,?,?,?)",data,function(err){
        if(err)
            resp.send(err.message);
        else
            resp.send("Data Saved");
    })
})
app.post("/needy-profile-process-update",function(req,resp){

    var data=[req.body.txtname,req.body.txtaddr,req.body.txtcity,req.body.txtadhr,req.body.txtemail];
    dbcon.query("update needy set name=?,address=?,city=?,acard=? where email=?",data,function(err){
        if(err)
            resp.write(err.message);
        else
            resp.write("Data Saved");
        resp.end();
    })
})
app.post("/med-avail-process",function(req,resp){
    
    if(req.files==null){
        req.body.picname="nopic.png"
    }
    else{
        req.body.picname=req.files.ppic.name;
        var uploadingPath=path.join(process.cwd(),"public","uploads",req.files.ppic.name);
        req.files.ppic.mv(uploadingPath,function(err){
            if(err)
                console.log(err);
            else
                console.log("Uploaded");
        });
    }
    var data=[req.body.txtemail,req.body.txtcity,req.body.txtname,req.body.txtcomp,req.body.txtdate,req.body.txtunit,req.body.txtqty,req.body.picname];
    dbcon.query("insert into medicines values(null,?,?,?,?,?,?,?,?,current_date(),1)",data,function(err){
        if(err)
            resp.write(err.message);
        else
            resp.write("Data Saved");
        resp.end();
    })
})
app.get("/med-find-city",function(req,resp){
    dbcon.query("select distinct city from medicines",function(err,res){
        resp.send(res);
    })
});
app.get("/med-find-medicines",function(req,resp){
    dbcon.query("select distinct medname from medicines where city=?",[req.query.city],function(err,res){
        resp.send(res);
    })
});
app.get("/med-find-pro",function(req,resp){
    dbcon.query("select * from medicines where city=? and medname=?",[req.query.city,req.query.medname],function(err,res){
        resp.send(res);
    })
});
app.get("/ajax-fetch",function(req,resp){
    dbcon.query("select*from profiles where email=?",[req.query.emailid],function(err,res){
        resp.send(res);
    })
})
app.get("/fetch-medicines",function(req,resp){
    //console.log(req.query.anyid);
    dbcon.query("select*from medicines where email=?",[req.query.email],function(err,res){
        resp.send(res);
       
    })
})
app.get("/ajax-fetch-needy",function(req,resp){
    //console.log(req.query.anyid);
    dbcon.query("select*from needy where email=?",[req.query.email],function(err,res){
        resp.send(res);
       
    })
})
app.get("/delete-fetch-medicines",function(req,resp){
    //console.log(req.query.anyid);
    dbcon.query("delete from medicines where rid=?",[req.query.rid],function(err,res){
        if(err){
            resp.send(err);
        }
        else{
            resp.send("Deleted successfully");
        }
    })
})
app.listen(3008,function(){
    console.log("server started");
})