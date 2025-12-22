import express from "express";
import morgan from "morgan";
import cors from "cors";

const PORT = process.env.PORT || 3000;
const app = express();
const option = {
  origin: ["http://127.0.0.1:8080", "http://localhost:5173", "http://127.0.0.1:5173", "http://127.0.0.1:5500", "http://localhost:5500"]
}

app.use(express.json());
app.use(morgan('dev'));
app.use(cors(option));

let data = [
  {
    id: 1,
    firstname: "Ibrahim",
    lastname: "KONDO",
    username: "ibraum",
    email: "ibraum@example.com",
    age: 24,
    isActive: true,
    field: "Computer Science",
  },
  {
    id: 2,
    firstname: "Amina",
    lastname: "Diallo",
    username: "aminad",
    email: "amina.diallo@example.com",
    age: 22,
    isActive: true,
    field: "Software Engineering",
  },
  {
    id: 3,
    firstname: "Jean",
    lastname: "Dupont",
    username: "jdupont",
    email: "jean.dupont@example.com",
    age: 27,
    isActive: true,
    field: "Web Development",
  },
  {
    id: 4,
    firstname: "Sarah",
    lastname: "Mensah",
    username: "sarahm",
    email: "sarah.mensah@example.com",
    age: 25,
    isActive: true,
    field: "Information Systems",
  },
  {
    id: 5,
    firstname: "Michael",
    lastname: "Brown",
    username: "mbrown",
    email: "michael.brown@example.com",
    age: 29,
    isActive: false,
    field: "Data Science",
  },
  {
    id: 6,
    firstname: "Fatou",
    lastname: "Sow",
    username: "fatous",
    email: "fatou.sow@example.com",
    age: 23,
    isActive: true,
    field: "Cybersecurity",
  },
];

app.get("/", (req, res) => {
  let message = "Read action";
  const response = {
    message,
    data,
  };

  if (data.length > 0) return res.status(200).send(response);

  return res.status(404).send(response);
});

app.post("/", (req, res) => {
  let message = "Create action";

  if (!req.body)
    return res.status(400).json({
      message: message + " : See the format bellow",
      format: {
        id: null,
        firstname: null,
        lastname: null,
        username: null,
        age: null,
        field: null,
        isActive: null,
      },
    });

  if (req.body.id == null) return res.status(400).send("Id is required !!");

  const id = Number(req.body.id);
  if (isNaN(id) || id < 0) return res.status(400).send("Id is not a valid number");

  const founded = data.find((d) => d.id === id);
  if (founded) return res.status(409).send("Id already exists !");

  const user = { ...req.body, id };
  data.push(user);

  const response = {
    message,
    data,
  };
  return res.status(201).send(response);
});

app.put("/:id", (req, res) => {
  const request_data = req.body;
  const id = Number(req.params.id);
  let message = "Update action";

  if (!request_data)
    return res.status(400).json({
      message: message + " : See the format bellow",
      format: {
        id: null,
        firstname: null,
        lastname: null,
        username: null,
        age: null,
        field: null,
        isActive: null,
      },
    });

  if (isNaN(id) || id < 0) return res.status(400).send("Params Id is not a valid number");

  const index = data.findIndex((d) => d.id === id);
  if (index === -1) return res.status(404).send("Id is not exists !");

  data[index] = { ...data[index], ...request_data, id };

  const response = {
    message,
    data,
  };

  return res.status(200).send(response);
});

app.delete("/:id", (req, res) => {
  const id = Number(req.params.id);

  const exists = data.some((d) => d.id === id);
  if (!exists) return res.status(404).send("Id is not exists !");

  data = data.filter((d) => d.id !== id);

  let message = "Delete action";
  const response = {
    message,
    data,
  };

  return res.status(200).send(response);
});

app.listen(PORT, (err) => {
  if (err) console.log("An error occure => ", err.message);
  console.log(`Your api are running on : http://localhost:${PORT}`);
});
