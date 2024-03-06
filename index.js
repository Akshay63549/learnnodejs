const cluster = require('node:cluster');
const totalCPUs=require('os').availableParallelism();
console.log(totalCPUs)
const express=require('express')
const users=require('./MOCK_DATA.json')
const cors = require('cors');


if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {
  const app = express();
  const port=5000;
// Enable all CORS requests
app.use(cors());
app.get('/', (req, res) => {
    res.status(200).send("server are healthy");
})

app.get('/users', (req, res) => {
    const html=`
    <ul>
    ${users.map((user) =>`<li>${user.first_name}</li>`).join("")}
    </ul>
    `
    res.status(200).send(html);
})

app.get('/api/users', (req, res) => {
    res.status(200).send(users);
})

app.post('/api/users', (req, res) => {
    res.status(200).send("user");
})
app.get('/api/users/:id', (req, res) => {
    const {id}=req.params
    const user= users.find(user => user.id === Number(id))
    res.status(200).send(user);
})

app.put('/api/users/:id', (req, res) => {
    const {id}=req.params
    res.status(200).send("user");
})

app.patch('/api/users/:id', (req, res) => {
    const {id}=req.params
    res.status(200).send("user");
})

app.delete('/api/users/:id', (req, res) => {
    const {id}=req.params
    res.status(200).send("user");
})


app.listen(port,()=>{
    console.log(`server running on ${port} with ${process.pid}`)
})

}



