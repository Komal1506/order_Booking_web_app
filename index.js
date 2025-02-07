const express = require("express");
const app = express();
const notifier = require("node-notifier");
console.log("index file running ");
const bodyparser = require("body-parser");
const con = require("./connection");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/views"));
app.set("view engine", "ejs");


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/Main.html");
});
let tempGroupData = [];
let tempSubgroupData = [];

app.post("/add-group", (req, res) => {
  tempGroupData = [];
  const { groupName, groupCode } = req.body;
 
  tempGroupData.push({ groupName, groupCode });
  
});


app.post("/add-subgroup", (req, res) => {
  tempSubgroupData = [];
  const { subgroupName, subgroupCode } = req.body;
  
  tempSubgroupData.push({ subgroupName, subgroupCode });
  
});

app.get("/existing-groups", (req, res) => {
  const sql = "SELECT DISTINCT GroupName FROM preitemmaster";
  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching group names: ", err);
      res.status(500).json({ error: "Error fetching group names" });
      return;
    }
    const existingGroupNames = result.map((row) => row.GroupName);
    res.status(200).json({ existingGroupNames });
  });
});

// Route to fetch existing subgroup names
app.get("/existing-subgroups", (req, res) => {
  const sql = "SELECT DISTINCT Subgroupname FROM item";
  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error fetching group names: ", err);
      res.status(500).json({ error: "Error fetching subgroup names" });
      return;
    }
    const existingsubgroupnames = result.map((row) => row.Subgroupname);
    res.status(200).json({ existingsubgroupnames });
  });
});


app.get("/", (req, res) => {
  res.sendFile(__dirname + "/Main.html");
});

app.post("/", (req, res) => {
  console.log("hiiii");
  const icode = req.body.itemCode;
  const iname = req.body.itemName;
  const barcode = req.body.barcode;
  const hsncode = req.body.hsnCode;
  const quantity = req.body.quantity;
  const deptname = req.body.deptName;
  const subdname = req.body.subDeptName;
  const hsngcode = req.body.hsnGroupCode;
  const pcase = req.body.packagingCase === "on" ? "on" : "off";
  const trading = req.body.trading === "on" ? "on" : "off";
  const consu = req.body.consumable === "on" ? "on" : "off";
  const pacunit = req.body.pacunit;
  const looseunit = req.body.looseunit;
  const convfactor = req.body.convfactor;
  const cratesltr = req.body.cratesltr;
  const rate1 = req.body.rate1;
  const rate2 = req.body.rate2;
  const rate3 = req.body.rate3;
  const tax = req.body.tax;
  const taxontax = req.body.taxontax;
  const addtax = req.body.addtax;
  const sales = req.body.salesGroup;
  const purchase = req.body.purchaseGroup;
  const reorder = req.body.reorder;
  const opstock = req.body.opstock;
  const maxrate = req.body.maxrate;
  const recorder = req.body.recorder;
  const loosestock = req.body.loosestock;
  const oprate = req.body.oprate;
  const opamount = req.body.opamount;
  console.log("connect succssfully");
  con.connect((error) => {
    if (error) {
      console.log(error);
    }
    var sql =
      "insert into preitemmaster (item_code,item_name,barcode,hsncode,quantity,deptname,subdeptname,hsngcode,pcase,trading,consu,pacunit,looseunit,convfactor,cratesltr,rate1,rate2,rate3,Tax,taxontax,addtax,sales,purchase,reorder,opstock,maxrate,recorder,loosestock,oprate,opamount,GroupName, Groupcode, Subgroupcode, Subgroupname) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    con.query(
      sql,
      [   
        icode,
        iname,
        barcode,
        hsncode,
        quantity,
        deptname,
        subdname,
        hsngcode,
        pcase,
        trading,
        consu,
        pacunit,
        looseunit,
        convfactor,
        cratesltr,
        rate1,
        rate2,
        rate3,
        tax,
        taxontax,
        addtax,
        sales,
        purchase,
        reorder,
        opstock,
        maxrate,
        recorder,
        loosestock,
        oprate,
        opamount,
        ...tempGroupData.map((group) => [group.groupName, group.groupCode]),
        ...tempSubgroupData.map((subgroup) => [
          subgroup.subgroupCode,
          subgroup.subgroupName,
        ]),
      ],
      (error, resp) => {
        console.log("hello");
        if (error) {
          console.log("error");
          console.log(error);
        }

        
        notifier.notify({
          title: 'Insertion Successful',
          message: 'Data inserted successfully!',
        });
        res.sendFile(__dirname + "/Main.html");
      }
    );
  });
});
// ...



// Define a route to handle the search request
app.get("/search", (req, res) => {
  // Get the search value from the query parameters
  const searchValue = req.query.searchValue;
  // Construct the SQL query to search for the item in the database
  const sql = `SELECT * FROM preitemmaster WHERE item_code ='${searchValue}'`;
  // Execute the SQL query
  con.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    notifier.notify({
      title: 'Search Successful',
      message: 'Data fetched successfully!',
    });
    res.render("read_item.ejs", { result });
 
  });
});

app.get("/login.html", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

app.get("/land_page", (req, res) => {
  res.sendFile(__dirname + "/LandPage.html");
});



app.post("/backtomain", (req, res) => {
  res.sendFile(__dirname + "/Main.html");
});

app.get("/delete_item", (req, res) => {
  con.query("delete from preitemmaster where id=?", [req.query.id], (err, eachrow) => {
    if (err) {
      console.log(err);
    } else {
    
      res.end("record deleted successfully");
    }
  });
});


//code for updating individual item
app.get("/update-data", (req, res) => {
  con.query(
    "select * from preitemmaster where item_code=?",
    [req.query.item_code],
    (err, eachrow) => {
      if (err) {
        console.log(err);
      } else {
       
        console.log("hiiiii");
        res.render(__dirname + "/update-data", { item: eachrow });
        
      }
    }
  );
});

app.post("/update-data", (req, res) => {
  const icode = req.body.itemCode;
  const iname = req.body.itemName;
  const barcode = req.body.barcode;
  const hsncode = req.body.hsnCode;
  const quantity = req.body.quantity;
  const deptname = req.body.deptName;
  const subdname = req.body.subDeptName;
  const hsngcode = req.body.hsnGroupCode;
  const pcase = req.body.packagingCase === "on" ? "on" : "off";
  const trading = req.body.trading === "on" ? "on" : "off";
  const consu = req.body.consumable === "on" ? "on" : "off";
  const pacunit = req.body.pacunit;
  const looseunit = req.body.looseunit;
  const convfactor = req.body.convfactor;
  const cratesltr = req.body.cratesltr;
  const rate1 = req.body.rate1;
  const rate2 = req.body.rate2;
  const rate3 = req.body.rate3;
  const tax = req.body.tax;
  const taxontax = req.body.taxontax;
  const addtax = req.body.addtax;
  const sales = req.body.salesGroup;
  const purchase = req.body.purchaseGroup;
  const reorder = req.body.reorder;
  const opstock = req.body.opstock;
  const maxrate = req.body.maxrate;
  const recorder = req.body.recorder;
  const loosestock = req.body.loosestock;
  const oprate = req.body.oprate;
  const opamount = req.body.opamount;
  var id = req.body.id;

  console.log("connect update  succssfully");

  var sql =
    "update preitemmaster  set item_code=?,item_name=?,barcode=?,hsncode=?,quantity=?,deptname=?,subdeptname=?,hsngcode=?,pcase=?,trading=?,consu=?,pacunit=?,looseunit=?,convfactor=?,cratesltr=?,rate1=?,rate2=?,rate3=?,Tax=?,taxontax=?,addtax=?,sales=?,purchase=?,reorder=?,opstock=?,maxrate=?,recorder=?,loosestock=?,oprate=?,opamount=? where id=?";
  con.query(
    sql,
    [
      icode,
      iname,
      barcode,
      hsncode,
      quantity,
      deptname,
      subdname,
      hsngcode,

      pcase,
      trading,
      consu,
      pacunit,
      looseunit,
      convfactor,
      cratesltr,
      rate1,
      rate2,
      rate3,
      tax,
      taxontax,
      addtax,
      sales,
      purchase,
      reorder,
      opstock,
      maxrate,
      recorder,
      loosestock,
      oprate,
      opamount,
      id,
    ],
    (error, result) => {
      if (error) console.log(error);
      else {
        notifier.notify({
          title: 'updation Successful',
          message: 'Data updated successfully!',
        });
         res.sendFile(__dirname + "/Main.html");
        
      }
    }
  );
});


app.listen(5000);
