const express = require('express');

const app = express();

app.use(express.json())

let data = [
    {
        id: 0,
        fullname: "KONDO Ibrahim",
        surname: "ibraum",
        age: null,
        field: "computer science"
    }
]

app.get('/', (req, res) => {
    let message = "Read action";
    const response = {
        message,
        data
    }
    res.send(response).status(200);
});

app.post('/', (req, res) => {
    let message = "Create action";
    data.push(
        req.body
    )
    res.send(response).status(201);
});

app.put('/:id', (req, res) => {
    let request_data = req.body
    const id = req.params.id

    data[id] = request_data

    let message = "Update action";

    const response = {
        message,
        data
    }

    res.send(response).status(200)
})

app.delete('/:id', (req, res) => {
    const id = req.params.id

    data = data.filter(d => d.id !== id)
    let message = "Delete action"
    const response = {
        message,
        data
    }

    res.send(response).status(200);
})