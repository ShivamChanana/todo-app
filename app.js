const express = require("express")
const app = express()
const port = process.env.PORT || 3000
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const nodemailer = require("nodemailer")
const passport = require("passport")
const session = require("express-session")
const cookieParser = require("cookie-parser")
const LocalStrategy = require('passport-local').Strategy
const todos = require("./models/Todos")
const User = require("./models/users")
const methodOverride = require("method-override")
const apiRouter = require("./routes/apiRouter")
var partials      = require('express-partials');

// app.use("/api", apiRouter)
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({ extended : true}))
app.use(bodyParser.json())
app.use(methodOverride("_method"))
app.use(express.static("public"))
app.use(cookieParser())
app.use(session({
    secret: "theShivam",
    resave: false,
    saveUninitialized: false
}))
app.use(partials());
let transporter = nodemailer.createTransport({
    pool: true,
    service: "Gmail",
    secure: false, // use SSL
    auth: {
        user: "testnodeappmail@gmail.com",
        pass: "123321asddsa"
    },
    tls: {
        rejectUnauthorized: false
    }
})


mongoose.connect("mongodb://localhost:27017/todolist")
.then(()=>{
    console.log("DB connected")
})
.catch((err)=>{
    console.log(err)
})


//init passport

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.getUserByEmail(username, function (err, user) {
            if (err) throw err
            if (!user) {
                return done(null, false, { message: 'Unknown User' })
            }
            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err
                if (isMatch) {
                    return done(null, user)
                } else {
                    return done(null, false, { message: 'Invalid password' })
                }
            })
        })
    }
))

passport.serializeUser(function (user, done) {
    done(null, user.id)
})

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user)
    })
})
//sending user object to every route.
app.use((req, res, next) => {
    res.locals.user = req.user
    next()
})



//appRoute

app.get("/", (req, res) => {
    res.render("index")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect("/home")
    }
)

app.get("/register", (req, res) => {
    res.render("register")
})

app.post("/register", (req, res) => {
    const password = req.body.password
    const password2 = req.body.password2
    if (password === password2) {
        var newUser = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        })

        User.createUser(newUser, async function (err, user) {
            if (err) {
                console.log(err)
            } else {
                var mailOptions = {
                    from: "Todo <testnodeappmail@gmail.com>", // sender address
                    to: user.email, // list of receivers
                    subject: `Thank your for registering.`, // Subject line
                    html: `<p>Hi ${user.name},</p>
                    <p>Thank you for registering.</p>
                    <p>Regards,</p>
                    <p>Team Todo.</p>`
                }
                // send mail with defined transport object
                await transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        console.log(err)
                    } else
                        console.log(info)
                })
                // console.log("User Created!")
                res.redirect("/login")
            }
        })
    } else {
        console.log("Password doesn't match")
    }
})


app.get("/home", isLoggedIn, (req,res)=>{
    todos.find()
    .then((data)=>{
        res.render("home", {data : data})
       })
    .catch((err)=>{
        console.log(err)
    })
})

app.post("/home", (req,res)=>{
    todos.create({
        name: req.body.name
    })
    .then(()=>{
        res.redirect("/home")
        
    })
    .catch((err)=>{
        console.log(err)
       
    })
})

//update
app.get("/home/update/:id", (req,res)=>{
    todos.findById(req.params.id)
    .then((data)=>{
        res.render("update", {updateTask : data})
    })
    .catch((err=>{
        console.log(err)
    }))
})

app.put("/home/update/:id", (req,res)=>{
    todos.findByIdAndUpdate((req.params.id), {
        name: req.body.name
         })
    .then(()=>{
        res.redirect("/home")
        
    })
    .catch((err)=>{
        console.log(err)
        
    })
})

//delete
app.delete("/home/delete/:id", (req,res)=>{
    todos.findByIdAndDelete(req.params.id)
    .then(()=>{
        res.redirect("/home")  
    })
    .catch((err)=>{
        console.log(err)
    })
})


app.get('/logout', function (req, res) {
    req.logout()
    res.redirect('/login')
})

function isLoggedIn(req, res, next) {
    if (req.user) {
        return next()
    }
    // req.flash("error", "Login First!")
    res.redirect('/login')
}



app.listen(port, (req,res)=>{
    console.log(`App is running at port ${port}`)
})