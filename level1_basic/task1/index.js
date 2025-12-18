import e from "express";
import morgan from "morgan";

const PORT = process.env.PORT;
const app = e();

app.use(e.json());
app.use(morgan());

let data = [
  {
    id: 0,
    fullname: "KONDO Ibrahim",
    surname: "ibraum",
    age: null,
    field: "computer science",
  },
];

app.get("/", (req, res) => {
  let message = "Read action";
  const response = {
    message,
    data,
  };

  if (data) return res.status(200).send(response);

  return res.status(404).send(response);
});

app.post("/", (req, res) => {
  let message = "Create action";

  if (!req.body)
    return res.status(400).json({
      message: message + " : See the format bellow",
      format: {
        id: null,
        fullname: null,
        surname: null,
        age: null,
        field: null,
      },
    });
  if (req.body.id === null) return res.status(400).send("Id is required !!");
  if (isNaN(req.body.id) || req.body.id < 0)
    return res.status(400).send("Id is not a valid number");
  const founded = data.find((d) => d.id === req.body.id);

  if (founded) return res.status(409).send("Id already exists !");

  data.push(req.body);

  const response = {
    message,
    data,
  };
  return res.status(201).send(response);
});

app.put("/:id", (req, res) => {
  let request_data = req.body;
  const id = req.params.id;
  let message = "Update action";

  if (!req.body)
    return res.status(400).json({
      message: message + " : See the format bellow",
      format: {
        id: null,
        fullname: null,
        surname: null,
        age: null,
        field: null,
      },
    });
  if (!id) return res.status(400).send("Params Id is required !!");
  if (isNaN(id) || id < 0)
    return res.status(400).send("Params Id is not a valid number");

  const founded = data.find((d) => {
    id === d.id;
  });
  if (founded) return res.status(404).send("Id is not exists !");

  data[id] = request_data;

  const response = {
    message,
    data,
  };

  return res.status(200).send(response);
});

app.delete("/:id", (req, res) => {
  const id = Number(req.params.id) 

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

app.listen(PORT | 3000, (err) => {
  if (err) console.log("An error occure => ", err.message);
  console.log(`Your api are running on : http://localhost:${PORT | 3000}`);
});
