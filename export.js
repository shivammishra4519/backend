const csvParser=require('json2csv').Parser;
const PDFDocument = require('pdfkit');
const { getDB } = require('./db_connection');

const getCsv=async(req,res)=>{
try{
const db=getDB();
const collection=db.collection('devices');
const result=await collection.find().toArray();
const csvFields=['_id','ownerName', 'ownerMoblieNumber', 'imeiNumber1', 'imeiNumber2', 'brandName', 'modelName', 'lostDate', 'lastMobileNumber', 'losePlace', 'email', 'bill', 'registerUser', 'distributor', 'transactionId', 'transactionStatus', 'updated']
const parse=new csvParser({csvFields});
const csvData=parse.parse(result);
res.setHeader("Content-Type","text/csv")
res.setHeader("Content-Disposition","attatchment: filename=devicesData.csv")
res.status(200).end(csvData)
}catch(error){
    res.status(400).json(error.message)
}
}

const getPDF = async (req, res) => {
  try {
    const db = getDB();
    const collection = db.collection('devices');
    const result = await collection.find().toArray();

    // Create a new PDF document
    const doc = new PDFDocument();

    // Set response headers for PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=devicesData.pdf');

    // Pipe the PDF document directly to the response
    doc.pipe(res);

    // Add content to the PDF using result data
    result.forEach((device) => {
      doc.text(`Owner Name: ${device.ownerName}`);
      doc.text(`IMEI Number 1: ${device.imeiNumber1}`);
      // Add other fields as needed
      doc.moveDown(); // Move to the next line
    });

    // Finalize the PDF and end the response
    doc.end();
  } catch (error) {
    res.status(400).json(error.message);
  }
};

// module.exports = { getPDF };


module.exports={getCsv,getPDF}