//Requiring the necessary packages
const express = require("express");
const app = express();
const helmet = require("helmet");
const fs = require("fs");
const notFound = require("./middleware/notFound");
const bodyParser = require("body-parser");
const cors = require("cors");

const multer = require("multer"); // Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const categoryFolder = `./uploads/${req.body.categoryName}`;
    fs.mkdirSync(categoryFolder, { recursive: true }); // ✅ Create folder
    cb(null, categoryFolder);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Keep original file name
  },
});

const upload = multer({ storage });

// const upload = multer({ storage: storage });
const corsOptions = {
  origin: "*", // Replace with your own domain
};
app.use(cors(corsOptions));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: [
          "'self'",
          "http://192.168.13.95:5001",
          "http://localhost:5001",
        ],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "http://192.168.13.95:5001",
          "http://localhost:5001",
        ],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "http://192.168.13.95:5001",
          "http://localhost:5001",
        ],
        // reportUri: '/report-violation',
        // objectSrc: ["'self'"]
      },
    },
    referrerPolicy: { policy: "same-origin" },
  })
);
//to parse request parameters
const payloadLimit = 500 * 1024 * 1024;
app.use(bodyParser.json({ limit: payloadLimit })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: payloadLimit, extended: true }));
const jwt = require("./middleware/jsonWebToken");
// app.use(jwt.verifyToken);

// Create a new router for API routes
const api = express.Router(); // Define the `api` router
app.use("", api);
//checkUserAccess = userAccess.checkUserAccess;
//Importing modules
/***************************LOGIN  & SIGNUP MODULE API*********************/
const { login } = require("./controllers/login/login");
const { addUser } = require("./controllers/user/addUser");
const { getAllUsers } = require("./controllers/user/getAllUsers");
const { profile } = require("./controllers/user/profile")
const { updatePassword } = require("./controllers/user/updatePassword")

const { uploadCourse } = require("./controllers/courses/uploadCourse");
const {
  addNewCourseCategory,
} = require("./controllers/courseCategory/addNewCourseCategory");
const { addNewCourse } = require("./controllers/courses/addNewCourse");
const {
  giveAccessOfCourseToUser,
} = require("./controllers/users/giveAccessOfCourse");
const { getCourseContent } = require("./controllers/courses/getCourseContent");
/****************************************************************/
api.post("/login", login);
api.post("/addUser", addUser);
api.post("/profile", profile)
api.post("/updatePassword", updatePassword)

api.post(
  "/uploadCourse",
  upload.single("fileInformations"),
  // upload.array("fileInformations"), // handle multiple file uploads
  uploadCourse
);
api.post("/addNewCourseCategory", addNewCourseCategory);
api.post("/addNewCourse", addNewCourse);
api.post("/getAllUsers", getAllUsers);
api.post("/giveAccessOfCourseToUser", giveAccessOfCourseToUser);
api.post("/getCourseContent", getCourseContent);
// Use /api as a base path for all routes
app.use("", api);

//when route does not exists error message
app.use(notFound);

module.exports = app;
