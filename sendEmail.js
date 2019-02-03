function sendEmails() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var startRow = 2; // First row of data to process
  var numRows = 15; // Number of rows to process
  // Fetch the range of cells A2:B3
  var file1 = DriveApp.getFileById('*****');
  //  var file2 = DriveApp.getFilesByName('developer1.pdf');
  var file = DriveApp.getFileById('***');
  //  var file = file2.next();
  var dataRange = sheet.getRange(startRow, 1, numRows, 3);
  // Fetch values for each row in the Range.
  var data = dataRange.getValues();
  for (i in data) {
    var row = data[i];
    var name = row[0]; // First column
    var emailAddress = row[1]; // Second column
    var field = row[2]; // Third column
    var message = "<p dir=\"ltr\"><strong>Respected Prof. Dr. " + name + "</strong></p>" +
      "<p dir=\"ltr\">&nbsp;</p>" +
      "<p dir=\"ltr\">&nbsp;</p>" +
      "<p dir=\"ltr\">I am John Ellan from [Country Name].&nbsp; I have done my Bachelor&rsquo;s degree in the field of Computer Science from YOur university with CGPA: <strong>3.83/4.0</strong>.&nbsp; I have One and a Half years experience of Software Development in a well reputed software houses company name .</p>" +
      "<p dir=\"ltr\">&nbsp;</p>" +
      "<p dir=\"ltr\">Having gone through your profile, I am quite inspired your research work on the &ldquo;<strong>" + field + "</strong>&rdquo; which is the similar to my interests.</p>" +
      "<p dir=\"ltr\">&nbsp;</p>" +
      "<p dir=\"ltr\">I am solely interested in doing <strong>Master</strong> under your kind supervision, all the expense of my research will be sponsored by <strong>Chinese government Scholarship</strong> or any other available scholarship at your University if I am able to get the acceptance from you. I have attached my Curriculum vitae (CV), Transcript, and I would be happy to send you any additional materials on demand.</p>" +
      "<p dir=\"ltr\">&nbsp;</p>" +
      "<p dir=\"ltr\">Early thanks for your consideration and I would wait for your kind response.</p>" +
      "<p dir=\"ltr\">&nbsp;</p>" +
      "<p dir=\"ltr\"><span style=\"font-size: 15pt;\"><strong>Best Regards,</strong></span></p>" +
      "<p dir=\"ltr\">&nbsp;</p>" +
      "<p dir=\"ltr\"><span style=\"font-size: 13pt;\"><strong>name,</strong></span></p>" +
      "<p dir=\"ltr\"><span style=\"font-size: 12pt;\">uni name,</span></p>" +
      "<p dir=\"ltr\"><span style=\"font-size: 12pt;\">address.</span></p>" +
      "<p dir=\"ltr\"><span style=\"font-size: 12pt;\">Email: <a href=\"your email\" target=\"_blank\">email</a></span></p>";
    var subject = 'Request for Acceptance letter for Master Program';
    MailApp.sendEmail({
      to: emailAddress, subject: subject,
      htmlBody: message,
      attachments: [file.getAs(MimeType.PDF), file1.getAs(MimeType.JPEG)]
    });
  }
}